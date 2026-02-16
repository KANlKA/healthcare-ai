import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import CarePlan from '@/models/CarePlan';
import CareStep from '@/models/CareStep';
import Dependency from '@/models/Dependency';

export async function GET(
  request: NextRequest,
  { params }: { params: { carePlanId: string } }
) {
  try {
    await connectDB();

    const { carePlanId } = params;

    // Fetch care plan
    const carePlan = await CarePlan.findOne({ templateId: carePlanId }).lean();
    if (!carePlan) {
      return NextResponse.json({ error: 'Care plan not found' }, { status: 404 });
    }

    // Fetch all care steps
    const steps = await CareStep.find({ carePlanId }).lean();
    
    // Fetch dependencies
    const dependencies = await Dependency.find({ carePlanId }).lean();

    // Calculate complexity metrics
    const analysis = analyzeComplexity(steps, dependencies, carePlan);

    return NextResponse.json(
      {
        carePlanId,
        carePlanName: carePlan.scenarioName,
        analysis,
        timestamp: new Date().toISOString()
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
        }
      }
    );

  } catch (error: any) {
    console.error('Error analyzing complexity:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to analyze complexity',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

function analyzeComplexity(steps: any[], dependencies: any[], carePlan: any) {
  const stepCount = steps.length;
  const dependencyDepth = calculateMaxDependencyDepth(dependencies);
  const concurrentActivities = calculateMaxConcurrentSteps(steps);
  const frequencyVariance = calculateFrequencyVariance(steps);

  // Complexity score calculation (0-100)
  const stepComplexity = Math.min((stepCount / 20) * 25, 25);
  const dependencyComplexity = Math.min((dependencyDepth / 5) * 30, 30);
  const concurrencyComplexity = Math.min((concurrentActivities / 10) * 25, 25);
  const varianceComplexity = Math.min(frequencyVariance * 20, 20);

  const overallScore = Math.round(
    stepComplexity + dependencyComplexity + concurrencyComplexity + varianceComplexity
  );

  // Identify high-complexity areas
  const highComplexitySteps = steps
    .filter(s => s.complexityScore > 70)
    .map(s => ({
      stepId: s.stepId,
      description: s.description,
      complexityScore: s.complexityScore,
      contributingFactors: identifyComplexityFactors(s, dependencies)
    }));

  return {
    overallScore,
    level: overallScore < 33 ? 'low' : overallScore < 66 ? 'moderate' : 'high',
    factors: {
      stepCount,
      dependencyDepth,
      concurrentActivities,
      frequencyVariance: Math.round(frequencyVariance * 100) / 100
    },
    breakdown: [
      {
        category: 'Step Count',
        score: Math.round(stepComplexity),
        description: `${stepCount} total care steps`
      },
      {
        category: 'Dependencies',
        score: Math.round(dependencyComplexity),
        description: `Maximum dependency depth: ${dependencyDepth}`
      },
      {
        category: 'Concurrency',
        score: Math.round(concurrencyComplexity),
        description: `Up to ${concurrentActivities} concurrent activities`
      },
      {
        category: 'Frequency Variance',
        score: Math.round(varianceComplexity),
        description: `Timing complexity score`
      }
    ],
    categoryDistribution: {
      medication: steps.filter(s => s.category === 'medication').length,
      exercise: steps.filter(s => s.category === 'exercise').length,
      monitoring: steps.filter(s => s.category === 'monitoring').length,
      appointment: steps.filter(s => s.category === 'appointment').length,
      lifestyle: steps.filter(s => s.category === 'lifestyle').length
    },
    highComplexityAreas: highComplexitySteps,
    recommendations: generateRecommendations(overallScore, steps, dependencies)
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

function calculateFrequencyVariance(steps: any[]): number {
  const frequencies = steps.map(s => {
    const freq = s.timing.frequency.toLowerCase();
    if (freq.includes('daily')) return 1;
    if (freq.includes('twice')) return 2;
    if (freq.includes('three')) return 3;
    if (freq.includes('weekly')) return 0.14;
    return 1;
  });

  const mean = frequencies.reduce((a, b) => a + b, 0) / frequencies.length;
  const variance = frequencies.reduce((sum, f) => sum + Math.pow(f - mean, 2), 0) / frequencies.length;

  return Math.sqrt(variance);
}

function identifyComplexityFactors(step: any, dependencies: any[]): string[] {
  const factors: string[] = [];

  if (step.dependencies && step.dependencies.length > 2) {
    factors.push('Multiple prerequisites');
  }

  if (step.timing.timeOfDay && step.timing.timeOfDay.length > 2) {
    factors.push('Multiple daily occurrences');
  }

  if (step.metadata.warningFlags && step.metadata.warningFlags.length > 0) {
    factors.push('Safety warnings present');
  }

  if (step.riskLevel === 'high') {
    factors.push('High risk activity');
  }

  const relatedDeps = dependencies.filter(
    d => d.sourceStepId === step.stepId || d.targetStepId === step.stepId
  );
  if (relatedDeps.length > 3) {
    factors.push('Highly interconnected');
  }

  return factors;
}

function generateRecommendations(score: number, steps: any[], dependencies: any[]): string[] {
  const recommendations: string[] = [];

  if (score >= 66) {
    recommendations.push('Consider breaking down complex steps into smaller, manageable tasks');
    recommendations.push('Use the plain language feature to simplify instructions');
    recommendations.push('Review the dependency graph to understand step relationships');
  }

  if (steps.filter(s => s.riskLevel === 'high').length > 3) {
    recommendations.push('Pay special attention to high-risk activities');
    recommendations.push('Set up reminders for critical care steps');
  }

  const maxConcurrent = calculateMaxConcurrentSteps(steps);
  if (maxConcurrent > 5) {
    recommendations.push('Some days have many activities - plan ahead and prioritize');
  }

  if (dependencies.length > steps.length) {
    recommendations.push('Many steps depend on others - follow the recommended sequence');
  }

  return recommendations;
}