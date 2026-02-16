export interface CareStep {
  stepId: string;
  carePlanId: string;
  description: string;
  medicalContext: string;
  timing: {
    frequency: string;
    timeOfDay: string[];
    duration?: number;
    startDay: number;
    endDay: number;
  };
  category: 'medication' | 'exercise' | 'monitoring' | 'appointment' | 'lifestyle';
  instructions: string;
  dependencies: string[];
  riskLevel: 'low' | 'medium' | 'high';
  complexityScore: number;
  plainLanguageVersion?: string;
  metadata: {
    estimatedTime: number;
    requiredSupplies: string[];
    warningFlags: string[];
  };
}