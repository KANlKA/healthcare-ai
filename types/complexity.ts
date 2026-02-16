export interface ComplexityMetrics {
  overallScore: number;
  stepCount: number;
  avgDependencyDepth: number;
  concurrentActivities: number;
}

export interface ComplexityAnalysis {
  overallScore: number;
  level: 'low' | 'moderate' | 'high';
  factors: {
    stepCount: number;
    dependencyDepth: number;
    concurrentActivities: number;
    frequencyVariance?: number;
  };
  breakdown: Array<{
    category: string;
    score: number;
    description: string;
  }>;
  categoryDistribution?: {
    medication: number;
    exercise: number;
    monitoring: number;
    appointment: number;
    lifestyle: number;
  };
  highComplexityAreas?: Array<{
    stepId: string;
    description: string;
    complexityScore: number;
    contributingFactors: string[];
  }>;
  recommendations?: string[];
}