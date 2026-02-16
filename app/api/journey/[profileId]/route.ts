// app/api/journey/[profileId]/route.ts
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
    const carePlan = await CarePlan.findOne({ templateId: profile.carePlanId }).lean();
    if (!carePlan) {
      return NextResponse.json({ error: 'Care plan not found' }, { status: 404 });
    }

    // Fetch all care steps
    const steps = await CareStep
      .find({ carePlanId: profile.carePlanId })
      .sort({ 'timing.startDay': 1 })
      .lean();

    // Fetch all dependencies
    const dependencies = await Dependency
      .find({ carePlanId: profile.carePlanId })
      .lean();

    // Fetch risk metadata for all steps
    const stepIds = steps.map(s => s.stepId);
    const riskData = await RiskMetadata
      .find({ stepId: { $in: stepIds } })
      .lean();

    // Build timeline data
    const timeline = buildTimeline(steps, carePlan.durationDays);

    // Build complexity analysis
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
          highRiskSteps: steps.filter(s => s.riskLevel === 'high').length,
          averageComplexity: Math.round(
            steps.reduce((sum, s) => sum + s.complexityScore, 0) / steps.length
          )
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
      { 
        error: 'Failed to fetch journey',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

function buildTimeline(steps: any[], durationDays: number) {
  const timeline: any[] = [];
  
  for (let day = 1; day <= durationDays; day++) {
    const daySteps = steps.filter(
      step => day >= step.timing.startDay && day <= step.timing.endDay
    );
    
    timeline.push({
      day,
      stepCount: daySteps.length,
      steps: daySteps.map(s => ({
        stepId: s.stepId,
        description: s.description,
        category: s.category,
        timeOfDay: s.timing.timeOfDay,
        riskLevel: s.riskLevel
      }))
    });
  }
  
  return timeline;
}

function analyzeComplexity(steps: any[], dependencies: any[], carePlan: any) {
  const stepCount = steps.length;
  const dependencyDepth = calculateMaxDependencyDepth(dependencies);
  const concurrentActivities = calculateMaxConcurrentSteps(steps);
  
  // Complexity score formula (0-100)
  const stepComplexity = Math.min((stepCount / 20) * 30, 30);
  const dependencyComplexity = Math.min((dependencyDepth / 5) * 35, 35);
  const concurrencyComplexity = Math.min((concurrentActivities / 10) * 35, 35);
  
  const overallScore = Math.round(stepComplexity + dependencyComplexity + concurrencyComplexity);
  
  return {
    overallScore,
    level: overallScore < 33 ? 'low' : overallScore < 66 ? 'moderate' : 'high',
    factors: {
      stepCount,
      dependencyDepth,
      concurrentActivities,
      stepComplexity: Math.round(stepComplexity),
      dependencyComplexity: Math.round(dependencyComplexity),
      concurrencyComplexity: Math.round(concurrencyComplexity)
    },
    breakdown: {
      medication: steps.filter(s => s.category === 'medication').length,
      exercise: steps.filter(s => s.category === 'exercise').length,
      monitoring: steps.filter(s => s.category === 'monitoring').length,
      appointment: steps.filter(s => s.category === 'appointment').length,
      lifestyle: steps.filter(s => s.category === 'lifestyle').length
    }
  };
}

function calculateMaxDependencyDepth(dependencies: any[]): number {
  if (dependencies.length === 0) return 0;
  
  const graph: { [key: string]: string[] } = {};
  dependencies.forEach(dep => {
    if (!graph[dep.sourceStepId]) graph[dep.sourceStepId] = [];
    graph[dep.sourceStepId].push(dep.targetStepId);
  });
  
  let maxDepth = 0;
  const visited = new Set<string>();
  
  function dfs(node: string, depth: number) {
    if (visited.has(node)) return;
    visited.add(node);
    maxDepth = Math.max(maxDepth, depth);
    
    if (graph[node]) {
      graph[node].forEach(child => dfs(child, depth + 1));
    }
  }
  
  Object.keys(graph).forEach(node => {
    visited.clear();
    dfs(node, 1);
  });
  
  return maxDepth;
}

function calculateMaxConcurrentSteps(steps: any[]): number {
  const daySteps: { [key: number]: number } = {};
  
  steps.forEach(step => {
    for (let day = step.timing.startDay; day <= step.timing.endDay; day++) {
      daySteps[day] = (daySteps[day] || 0) + 1;
    }
  });
  
  return Math.max(...Object.values(daySteps), 0);
}