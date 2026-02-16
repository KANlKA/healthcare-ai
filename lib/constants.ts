export const APP_NAME = 'CAREPATH-AI';
export const APP_DESCRIPTION = 'AI-powered healthcare journey explainer with safety-first design';

export const CARE_CATEGORIES = {
  MEDICATION: 'medication',
  EXERCISE: 'exercise',
  MONITORING: 'monitoring',
  APPOINTMENT: 'appointment',
  LIFESTYLE: 'lifestyle'
} as const;

export const CARE_CATEGORY_LABELS = {
  medication: 'Medication',
  exercise: 'Exercise',
  monitoring: 'Monitoring',
  appointment: 'Appointment',
  lifestyle: 'Lifestyle'
} as const;

export const CARE_CATEGORY_COLORS = {
  medication: 'bg-blue-100 text-blue-800',
  exercise: 'bg-purple-100 text-purple-800',
  monitoring: 'bg-orange-100 text-orange-800',
  appointment: 'bg-pink-100 text-pink-800',
  lifestyle: 'bg-teal-100 text-teal-800'
} as const;

export const RISK_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
} as const;

export const COMPLEXITY_LEVELS = {
  LOW: 'low',
  MODERATE: 'moderate',
  HIGH: 'high'
} as const;

export const LITERACY_LEVELS = {
  BASIC: 'basic',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced'
} as const;

export const ADHERENCE_PATTERNS = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
} as const;

export const DEPENDENCY_TYPES = {
  PREREQUISITE: 'prerequisite',
  TIMING_CONSTRAINT: 'timing_constraint',
  INTERACTION_WARNING: 'interaction_warning',
  COMPLEMENTARY: 'complementary'
} as const;

export const DEPENDENCY_CRITICALITY = {
  INFORMATIONAL: 'informational',
  RECOMMENDED: 'recommended',
  REQUIRED: 'required'
} as const;

export const CACHE_DURATION = {
  SHORT: 60 * 5, // 5 minutes
  MEDIUM: 60 * 60, // 1 hour
  LONG: 60 * 60 * 24, // 1 day
  WEEK: 60 * 60 * 24 * 7 // 1 week
} as const;

export const AI_MODELS = {
  LLAMA_70B: 'llama-3.1-70b-versatile',
  MIXTRAL: 'mixtral-8x7b-32768'
} as const;

export const MAX_TOKENS = {
  EXPLANATION: 500,
  SUMMARY: 800,
  SIMPLIFICATION: 400
} as const;

export const API_ENDPOINTS = {
  PROFILES: '/api/profiles',
  JOURNEY: '/api/journey',
  EXPLAIN: '/api/explain',
  SIMPLIFY: '/api/simplify',
  COMPLEXITY: '/api/complexity',
  RISK: '/api/risk',
  SIMULATE: '/api/simulate',
  SUMMARIZE: '/api/summarize',
  VALIDATE: '/api/validate',
  HEALTH: '/api/health'
} as const;

export const EMERGENCY_CONTACTS = {
  US: {
    emergency: '911',
    suicide: '988',
    poison: '1-800-222-1222'
  }
} as const;

export const DISCLAIMERS = {
  MAIN: 'This is an educational tool using synthetic patient data. It does not provide medical advice, diagnosis, or treatment recommendations. Always consult with qualified healthcare providers for medical decisions.',
  SYNTHETIC_DATA: 'All patient profiles and scenarios are fictional and created for educational purposes only.',
  AI_GENERATED: 'This content is AI-generated for educational purposes. Always follow your healthcare provider\'s specific instructions.',
  RISK: 'This is educational information about care adherence importance, not a medical assessment.',
  SIMULATION: 'This simulation is for educational purposes only and shows general patterns. Individual outcomes vary significantly.'
} as const;

export const TIME_OF_DAY_OPTIONS = [
  'morning',
  'afternoon',
  'evening',
  'night',
  'before_meals',
  'after_meals',
  'bedtime'
] as const;

export const FREQUENCY_OPTIONS = [
  'once daily',
  'twice daily',
  'three times daily',
  'four times daily',
  'weekly',
  'as needed'
] as const;
