import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import CareStep from '@/models/CareStep';
import RiskMetadata from '@/models/RiskMetadata';
import Dependency from '@/models/Dependency';

export async function GET(
  request: NextRequest,
  { params }: { params: { stepId: string } }
) {
  try {
    await connectDB();

    const { stepId } = params;

    // Fetch care step
    const step = await CareStep.findOne({ stepId }).lean();
    if (!step) {
      return NextResponse.json({ error: 'Care step not found' }, { status: 404 });
    }

    // Fetch risk metadata
    const riskData = await RiskMetadata.findOne({ stepId }).lean();

    // Fetch related dependencies to understand impact
    const dependencies = await Dependency.find({
      $or: [
        { sourceStepId: stepId },
        { targetStepId: stepId }
      ]
    }).lean();

    // Calculate risk context
    const riskAssessment = assessRisk(step, riskData, dependencies);

    return NextResponse.json(
      {
        stepId,
        stepDescription: step.description,
        riskAssessment,
        timestamp: new Date().toISOString()
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
        }
      }
    );

  } catch (error: any) {
    console.error('Error fetching risk assessment:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch risk assessment',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

function assessRisk(step: any, riskData: any, dependencies: any[]) {
  const dependentSteps = dependencies.filter(d => d.sourceStepId === step.stepId);
  const prerequisiteSteps = dependencies.filter(d => d.targetStepId === step.stepId);

  const assessment = {
    riskLevel: step.riskLevel,
    riskType: riskData?.riskType || 'general',
    impactScore: calculateImpactScore(step, dependencies),
    consequenceDescription: riskData?.consequenceDescription || 
      'Missing this care step may affect your recovery progress. Please follow your healthcare provider\'s instructions.',
    mitigationGuidance: riskData?.mitigationGuidance || 
      'Set reminders and maintain consistent adherence to your care plan.',
    
    context: {
      hasPrerequisites: prerequisiteSteps.length > 0,
      prerequisiteCount: prerequisiteSteps.length,
      affectsOtherSteps: dependentSteps.length > 0,
      dependentStepCount: dependentSteps.length,
      timingCritical: step.timing.frequency.toLowerCase().includes('specific') ||
                      step.timing.timeOfDay.length > 0,
      category: step.category
    },

    relatedSteps: [
      ...dependentSteps.map(d => ({
        stepId: d.targetStepId,
        relationship: 'depends_on_this',
        criticality: d.criticality
      })),
      ...prerequisiteSteps.map(d => ({
        stepId: d.sourceStepId,
        relationship: 'prerequisite',
        criticality: d.criticality
      }))
    ],

    adherenceImportance: riskData?.impactFactors?.adherenceImportance || 
      (step.riskLevel === 'high' ? 9 : step.riskLevel === 'medium' ? 6 : 3),

    disclaimer: 'This is educational information about the importance of care adherence. ' +
                'It is not a medical assessment. Always consult your healthcare provider ' +
                'about your specific care plan and any concerns.'
  };

  return assessment;
}

function calculateImpactScore(step: any, dependencies: any[]): number {
  let score = 0;

  // Base risk level contribution
  if (step.riskLevel === 'high') score += 40;
  else if (step.riskLevel === 'medium') score += 25;
  else score += 10;

  // Dependency impact
  const dependentCount = dependencies.filter(d => d.sourceStepId === step.stepId).length;
  score += Math.min(dependentCount * 10, 30);

  // Category impact
  if (step.category === 'medication') score += 20;
  else if (step.category === 'monitoring') score += 15;
  else score += 10;

  // Timing criticality
  if (step.timing.timeOfDay && step.timing.timeOfDay.length > 0) score += 10;

  return Math.min(score, 100);
}