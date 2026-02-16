export interface Dependency {
  dependencyId: string;
  sourceStepId: string;
  targetStepId: string;
  dependencyType: 'prerequisite' | 'timing_constraint' | 'interaction_warning' | 'complementary';
  explanation: string;
  criticality: 'informational' | 'recommended' | 'required';
  timingConstraint?: {
    minHoursBefore?: number;
    maxHoursBefore?: number;
  };
  carePlanId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DependencyGraph {
  nodes: Array<{
    id: string;
    label: string;
    category?: string;
  }>;
  edges: Array<{
    source: string;
    target: string;
    type: string;
    criticality?: string;
  }>;
}