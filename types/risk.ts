export interface RiskMetadata {
  stepId: string;
  riskLevel: 'low' | 'medium' | 'high';
  riskType: 'medication_interaction' | 'timing_critical' | 'cumulative_effect' | 'safety_concern';
  consequenceDescription: string;
  mitigationGuidance: string;
  disclaimer: string;
  impactFactors: {
    adherenceImportance: number;
    consequenceSeverity: number;
    reversibility: 'reversible' | 'partially_reversible' | 'irreversible';
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RiskAssessment {
  stepId: string;
  stepDescription: string;
  riskLevel: string;
  riskType: string;
  impactScore: number;
  consequenceDescription: string;
  mitigationGuidance: string;
  context: {
    hasPrerequisites: boolean;
    prerequisiteCount: number;
    affectsOtherSteps: boolean;
    dependentStepCount: number;
    timingCritical: boolean;
    category: string;
  };
  relatedSteps: Array<{
    stepId: string;
    relationship: string;
    criticality: string;
  }>;
  adherenceImportance: number;
  disclaimer: string;
}