import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import CarePlan from '@/models/CarePlan';
import CareStep from '@/models/CareStep';

const requestSchema = z.object({
  carePlanId: z.string(),
  adherencePattern: z.enum(['high', 'medium', 'low']),
  timeframe: z.enum(['1week', '1month', '3months', 'full']).optional().default('full')
});

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { carePlanId, adherencePattern, timeframe } = requestSchema.parse(body);

    // Fetch care plan
    const carePlan = await CarePlan.findOne({ templateId: carePlanId }).lean();
    if (!carePlan) {
      return NextResponse.json({ error: 'Care plan not found' }, { status: 404 });
    }

    // Fetch steps
    const steps = await CareStep.find({ carePlanId }).lean();

    // Generate simulation
    const simulation = generateSimulation(carePlan, steps, adherencePattern, timeframe);

    return NextResponse.json({
      carePlanId,
      adherencePattern,
      timeframe,
      simulation,
      disclaimer: 'This simulation is for educational purposes only and shows general patterns ' +
                  'based on care adherence research. Individual outcomes vary significantly. ' +
                  'Consult your healthcare provider for personalized medical advice.',
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Error generating simulation:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to generate simulation',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

function generateSimulation(carePlan: any, steps: any[], adherence: string, timeframe: string) {
  const durationDays = carePlan.durationDays;
  const timeframeMap: { [key: string]: number } = {
    '1week': 7,
    '1month': 30,
    '3months': 90,
    'full': durationDays
  };
  
  const simulationDays = Math.min(timeframeMap[timeframe], durationDays);

  // Generate milestones based on adherence
  const milestones = generateMilestones(simulationDays, adherence, carePlan.scenarioName);

  // Calculate projected outcomes
  const outcomes = calculateOutcomes(steps, adherence, simulationDays);

  return {
    projectedDuration: simulationDays,
    adherenceRate: adherence === 'high' ? '90-100%' : 
                   adherence === 'medium' ? '60-80%' : '30-50%',
    
    milestones: milestones,
    
    projectedOutcomes: outcomes,

    keyFactors: [
      {
        factor: 'Medication Adherence',
        importance: 'Critical',
        impact: adherence === 'high' ? 'Optimal symptom management' :
                adherence === 'medium' ? 'Moderate symptom control' :
                'Reduced effectiveness'
      },
      {
        factor: 'Lifestyle Modifications',
        importance: 'High',
        impact: adherence === 'high' ? 'Supports recovery' :
                adherence === 'medium' ? 'Partial benefit' :
                'Limited improvement'
      },
      {
        factor: 'Monitoring Compliance',
        importance: 'High',
        impact: adherence === 'high' ? 'Early issue detection' :
                adherence === 'medium' ? 'Some monitoring gaps' :
                'Risk of missed complications'
      }
    ],

    recommendations: generateAdherenceRecommendations(adherence)
  };
}

function generateMilestones(days: number, adherence: string, scenarioName: string) {
  const baseMultiplier = adherence === 'high' ? 1 : adherence === 'medium' ? 1.3 : 1.7;

  return [
    {
      day: Math.round(7 * baseMultiplier),
      milestone: 'Initial Adjustment',
      description: adherence === 'high' ? 
        'Successfully adapted to care routine' :
        'Still adjusting to care requirements',
      likelihood: adherence === 'high' ? 'Very Likely' : 
                  adherence === 'medium' ? 'Likely' : 'Possible'
    },
    {
      day: Math.round(14 * baseMultiplier),
      milestone: 'Early Progress',
      description: adherence === 'high' ?
        'Noticeable improvements in key metrics' :
        'Some progress observed',
      likelihood: adherence === 'high' ? 'Very Likely' :
                  adherence === 'medium' ? 'Likely' : 'Uncertain'
    },
    {
      day: Math.round(30 * baseMultiplier),
      milestone: 'Established Routine',
      description: adherence === 'high' ?
        'Care activities well-integrated into daily life' :
        'Routine partially established',
      likelihood: adherence === 'high' ? 'Very Likely' :
                  adherence === 'medium' ? 'Possible' : 'Unlikely'
    },
    {
      day: Math.min(days, Math.round(60 * baseMultiplier)),
      milestone: 'Significant Progress',
      description: adherence === 'high' ?
        'Major improvements in overall health metrics' :
        'Moderate improvements noted',
      likelihood: adherence === 'high' ? 'Very Likely' :
                  adherence === 'medium' ? 'Possible' : 'Unlikely'
    }
  ].filter(m => m.day <= days);
}

function calculateOutcomes(steps: any[], adherence: string, days: number) {
  const highRiskSteps = steps.filter(s => s.riskLevel === 'high').length;
  const totalSteps = steps.length;

  return [
    {
      category: 'Overall Health',
      projection: adherence === 'high' ? 'Excellent trajectory' :
                  adherence === 'medium' ? 'Good progress expected' :
                  'Slower progress likely',
      confidence: adherence === 'high' ? 'High' : 'Medium'
    },
    {
      category: 'Risk Management',
      projection: adherence === 'high' ? 'Minimal complications expected' :
                  adherence === 'medium' ? 'Some risk of setbacks' :
                  'Elevated risk of complications',
      confidence: adherence === 'high' ? 'High' : adherence === 'medium' ? 'Medium' : 'Low'
    },
    {
      category: 'Care Plan Completion',
      projection: `Expected completion in ${Math.round(days * (adherence === 'high' ? 1 : adherence === 'medium' ? 1.2 : 1.5))} days`,
      confidence: 'Medium'
    }
  ];
}

function generateAdherenceRecommendations(adherence: string): string[] {
  const recommendations: string[] = [
    'Set daily reminders for all care activities',
    'Track your progress using a journal or app',
    'Communicate regularly with your healthcare team'
  ];

  if (adherence === 'medium' || adherence === 'low') {
    recommendations.push(
      'Identify and address barriers to adherence',
      'Consider simplifying your care routine',
      'Seek support from family or caregivers'
    );
  }

  if (adherence === 'low') {
    recommendations.push(
      'Discuss concerns with your healthcare provider',
      'Explore alternative care approaches if needed'
    );
  }

  return recommendations;
}