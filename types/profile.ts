export interface SyntheticProfile {
  profileId: string;
  name: string;
  age: number;
  gender: string;
  scenarioDescription: string;
  carePlanId: string;
  complexityLevel: 'low' | 'moderate' | 'high';
  languagePreference: string;
  literacyLevel: 'basic' | 'intermediate' | 'advanced';
  syntheticDataMarker: boolean;
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
}