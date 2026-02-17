// app/api/journey/[profileId]/route.ts
// FIXED VERSION - handles all 5 profiles with proper fallbacks

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SyntheticProfile from '@/models/SyntheticProfile';
import CarePlan from '@/models/CarePlan';
import CareStep from '@/models/CareStep';
import Dependency from '@/models/Dependency';
import RiskMetadata from '@/models/RiskMetadata';

export async function GET(
  request: NextRequest,
  { params }: { params: { profileId: string } }
) {
  try {
    await connectDB();

    const { profileId } = params;

    // Fetch profile
    const profile = await SyntheticProfile.findOne({ profileId }).lean();
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Fetch care plan
    const carePlan = await CarePlan.findOne({ templateId: (profile as any).carePlanId }).lean();
    if (!carePlan) {
      return NextResponse.json(
        { error: `Care plan not found for template: ${(profile as any).carePlanId}` },
        { status: 404 }
      );
    }

    // Fetch steps, dependencies, risk data in parallel
    const [steps, dependencies] = await Promise.all([
      CareStep.find({ carePlanId: (profile as any).carePlanId })
        .sort({ 'timing.startDay': 1 })
        .lean(),
      Dependency.find({ carePlanId: (profile as any).carePlanId }).lean(),
    ]);

    const stepIds = steps.map((s: any) => s.stepId);
    const riskData = stepIds.length > 0
      ? await RiskMetadata.find({ stepId: { $in: stepIds } }).lean()
      : [];

    // Build timeline
    const timeline = buildTimeline(steps, (carePlan as any).durationDays);

    // Analyze complexity
    const complexityAnalysis = analyzeComplexity(steps, dependencies, carePlan);

    return NextResponse.json(
      {
        profile,
        carePlan,
        steps,
        dependencies,
        riskData,
        timeline,
        complexityAnalysis,
        metadata: {
          totalSteps: steps.length,
          totalDependencies: dependencies.length,
          highRiskSteps: steps.filter((s: any) => s.riskLevel === 'high').length,
          averageComplexity: steps.length > 0
            ? Math.round(steps.reduce((sum: number, s: any) => sum + (s.complexityScore || 0), 0) / steps.length)
            : 0
        }
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600'
        }
      }
    );
  } catch (error: any) {
    console.error('Error fetching journey:', error);
    return NextResponse.json(
      { error: 'Failed to fetch journey', message: error.message },
      { status: 500 }
    );
  }
}

function buildTimeline(steps: any[], durationDays: number) {
  const timeline: any[] = [];
  const totalDays = Math.min(durationDays, 90); // cap at 90 for UI performance

  for (let day = 1; day <= totalDays; day++) {
    const daySteps = steps.filter(
      (step: any) => day >= step.timing.startDay && day <= step.timing.endDay
    );
    if (daySteps.length > 0) {
      timeline.push({
        day,
        stepCount: daySteps.length,
        steps: daySteps.map((s: any) => ({
          stepId: s.stepId,
          description: s.description,
          category: s.category,
          timeOfDay: s.timing?.timeOfDay || [],
          riskLevel: s.riskLevel
        }))
      });
    }
  }

  return timeline;
}

function analyzeComplexity(steps: any[], dependencies: any[], carePlan: any) {
  const stepCount = steps.length;

  if (stepCount === 0) {
    return {
      overallScore: 0,
      level: 'low',
      factors: { stepCount: 0, dependencyDepth: 0, concurrentActivities: 0 },
      breakdown: [
        { category: 'Step Count', score: 0, description: 'No steps found' },
        { category: 'Dependencies', score: 0, description: 'No dependencies' },
        { category: 'Concurrency', score: 0, description: 'No concurrent activities' }
      ],
      recommendations: ['Add care steps to see complexity analysis']
    };
  }

  const dependencyDepth = calculateMaxDependencyDepth(dependencies);
  const concurrentActivities = calculateMaxConcurrentSteps(steps);

  const stepComplexity = Math.min((stepCount / 20) * 30, 30);
  const dependencyComplexity = Math.min((dependencyDepth / 5) * 35, 35);
  const concurrencyComplexity = Math.min((concurrentActivities / 10) * 35, 35);

  const overallScore = Math.round(stepComplexity + dependencyComplexity + concurrencyComplexity);

  const recommendations: string[] = [];
  if (overallScore >= 66) {
    recommendations.push('This is a complex care plan — use the plain language feature for simpler explanations');
    recommendations.push('Review the dependency graph to understand the order of activities');
    recommendations.push('Consider setting reminders for high-risk steps');
  } else if (overallScore >= 33) {
    recommendations.push('Set reminders for daily medications and monitoring tasks');
    recommendations.push('Review the dependency graph to follow the correct sequence');
  } else {
    recommendations.push('This plan has manageable complexity — focus on consistent daily habits');
  }

  return {
    overallScore,
    level: overallScore < 33 ? 'low' : overallScore < 66 ? 'moderate' : 'high',
    factors: { stepCount, dependencyDepth, concurrentActivities },
    breakdown: [
      {
        category: 'Step Count',
        score: Math.round(stepComplexity),
        description: `${stepCount} total care steps across the plan`
      },
      {
        category: 'Dependencies',
        score: Math.round(dependencyComplexity),
        description: `${dependencies.length} dependencies (max depth: ${dependencyDepth})`
      },
      {
        category: 'Concurrency',
        score: Math.round(concurrencyComplexity),
        description: `Up to ${concurrentActivities} activities on the same day`
      }
    ],
    recommendations
  };
}

function calculateMaxDependencyDepth(dependencies: any[]): number {
  if (dependencies.length === 0) return 0;

  const graph: Record<string, string[]> = {};
  dependencies.forEach((dep: any) => {
    if (!graph[dep.sourceStepId]) graph[dep.sourceStepId] = [];
    graph[dep.sourceStepId].push(dep.targetStepId);
  });

  let maxDepth = 0;

  function dfs(node: string, depth: number, visited: Set<string>) {
    if (visited.has(node)) return;
    visited.add(node);
    maxDepth = Math.max(maxDepth, depth);
    (graph[node] || []).forEach((child: string) => dfs(child, depth + 1, new Set(visited)));
  }

  Object.keys(graph).forEach(node => dfs(node, 1, new Set()));
  return maxDepth;
}

function calculateMaxConcurrentSteps(steps: any[]): number {
  const daySteps: Record<number, number> = {};
  steps.forEach((step: any) => {
    const start = step.timing?.startDay || 1;
    const end = step.timing?.endDay || 1;
    for (let day = start; day <= end; day++) {
      daySteps[day] = (daySteps[day] || 0) + 1;
    }
  });
  const values = Object.values(daySteps);
  return values.length > 0 ? Math.max(...values) : 0;
}