import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import CarePlan from '@/models/CarePlan';
import CareStep from '@/models/CareStep';
import Dependency from '@/models/Dependency';
import RiskMetadata from '@/models/RiskMetadata';
import { aiService } from '@/services/ai-service';

const requestSchema = z.object({
  carePlanId: z.string(),
  format: z.enum(['json', 'text']).optional().default('json'),
  audience: z.enum(['doctor', 'patient', 'caregiver']).optional().default('doctor')
});

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { carePlanId, format, audience } = requestSchema.parse(body);

    // Fetch all data
    const carePlan = await CarePlan.findOne({ templateId: carePlanId }).lean();
    if (!carePlan) {
      return NextResponse.json({ error: 'Care plan not found' }, { status: 404 });
    }

    const steps = await CareStep.find({ carePlanId }).lean();
    const dependencies = await Dependency.find({ carePlanId }).lean();
    const riskData = await RiskMetadata.find({ 
      stepId: { $in: steps.map(s => s.stepId) }
    }).lean();

    // Generate summary
    const summary = generateSummary(carePlan, steps, dependencies, riskData, audience);

    if (format === 'text') {
      return new NextResponse(formatAsText(summary), {
        headers: {
          'Content-Type': 'text/plain',
          'Content-Disposition': `attachment; filename="care-summary-${carePlanId}.txt"`
        }
      });
    }

    return NextResponse.json({
      carePlanId,
      summary,
      generatedAt: new Date().toISOString(),
      audience
    });

  } catch (error: any) {
    console.error('Error generating summary:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to generate summary',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

function generateSummary(carePlan: any, steps: any[], dependencies: any[], riskData: any[], audience: string) {
  const highRiskSteps = steps.filter(s => s.riskLevel === 'high');
  const criticalDependencies = dependencies.filter(d => d.criticality === 'required');

  return {
    overview: {
      scenario: carePlan.scenarioName,
      description: carePlan.description,
      duration: `${carePlan.durationDays} days`,
      complexity: carePlan.complexityMetrics.overallScore >= 66 ? 'High' :
                  carePlan.complexityMetrics.overallScore >= 33 ? 'Moderate' : 'Low',
      totalSteps: steps.length
    },

    keyStatistics: {
      totalCareSteps: steps.length,
      highRiskActivities: highRiskSteps.length,
      criticalDependencies: criticalDependencies.length,
      estimatedDailyTimeCommitment: calculateDailyTime(steps),
      categoryBreakdown: {
        medication: steps.filter(s => s.category === 'medication').length,
        exercise: steps.filter(s => s.category === 'exercise').length,
        monitoring: steps.filter(s => s.category === 'monitoring').length,
        appointments: steps.filter(s => s.category === 'appointment').length,
        lifestyle: steps.filter(s => s.category === 'lifestyle').length
      }
    },

    criticalAreas: {
      highRiskSteps: highRiskSteps.map(s => ({
        stepId: s.stepId,
        description: s.description,
        category: s.category,
        riskType: riskData.find(r => r.stepId === s.stepId)?.riskType || 'general',
        reasoning: riskData.find(r => r.stepId === s.stepId)?.consequenceDescription ||
                   'High priority for adherence'
      })),

      keyDependencies: criticalDependencies.slice(0, 5).map(d => ({
        from: steps.find(s => s.stepId === d.sourceStepId)?.description || d.sourceStepId,
        to: steps.find(s => s.stepId === d.targetStepId)?.description || d.targetStepId,
        type: d.dependencyType,
        explanation: d.explanation
      }))
    },

    complexityFactors: {
      overallScore: carePlan.complexityMetrics.overallScore,
      mainFactors: [
        { factor: 'Number of Steps', value: steps.length },
        { factor: 'Dependency Depth', value: carePlan.complexityMetrics.avgDependencyDepth },
        { factor: 'Concurrent Activities', value: carePlan.complexityMetrics.concurrentActivities }
      ]
    },

    recommendations: generateAudienceRecommendations(audience, carePlan, steps, highRiskSteps),

    educationalNote: audience === 'doctor' ?
      'This summary is generated from synthetic educational data for demonstration purposes.' :
      'This summary provides an overview of the care journey. Always follow your healthcare provider\'s specific instructions.',

    disclaimer: 'This is an educational tool using synthetic data. All information should be verified with qualified healthcare providers.'
  };
}

function calculateDailyTime(steps: any[]): string {
  const totalMinutes = steps.reduce((sum, step) => {
    const duration = step.metadata?.estimatedTime || 15;
    const frequency = step.timing.frequency.toLowerCase();
    
    let dailyOccurrences = 1;
    if (frequency.includes('twice')) dailyOccurrences = 2;
    if (frequency.includes('three')) dailyOccurrences = 3;
    if (frequency.includes('four')) dailyOccurrences = 4;
    
    return sum + (duration * dailyOccurrences);
  }, 0);

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minutes`;
  }
  return `${minutes} minutes`;
}

function generateAudienceRecommendations(audience: string, carePlan: any, steps: any[], highRiskSteps: any[]): string[] {
  if (audience === 'doctor') {
    return [
      'Review high-risk activities with patient during consultation',
      'Ensure patient understands critical dependencies between care steps',
      'Consider complexity level when discussing adherence strategies',
      'Schedule follow-up based on care plan complexity and duration'
    ];
  }

  if (audience === 'caregiver') {
    return [
      'Set up daily reminders for all care activities',
      'Pay special attention to high-risk and time-sensitive activities',
      'Help maintain a care journal to track progress',
      'Communicate regularly with healthcare providers about any concerns'
    ];
  }

  // Patient recommendations
  return [
    'Follow the care plan sequence carefully',
    'Set reminders for activities with specific timing requirements',
    'Track your progress and note any concerns',
    'Contact your healthcare provider if you have questions or difficulties'
  ];
}

function formatAsText(summary: any): string {
  let text = `CARE PLAN SUMMARY\n`;
  text += `${'='.repeat(50)}\n\n`;
  
  text += `OVERVIEW\n`;
  text += `Scenario: ${summary.overview.scenario}\n`;
  text += `Duration: ${summary.overview.duration}\n`;
  text += `Complexity: ${summary.overview.complexity}\n`;
  text += `Total Steps: ${summary.overview.totalSteps}\n\n`;

  text += `KEY STATISTICS\n`;
  text += `High Risk Activities: ${summary.keyStatistics.highRiskActivities}\n`;
  text += `Critical Dependencies: ${summary.keyStatistics.criticalDependencies}\n`;
  text += `Daily Time Commitment: ${summary.keyStatistics.estimatedDailyTimeCommitment}\n\n`;

  text += `CRITICAL AREAS\n`;
  summary.criticalAreas.highRiskSteps.forEach((step: any, i: number) => {
    text += `${i + 1}. ${step.description} (${step.category})\n`;
  });

  text += `\n${summary.disclaimer}\n`;

  return text;
}