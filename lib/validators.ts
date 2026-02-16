import { z } from 'zod';

// Care Category Schema
export const careCategorySchema = z.enum([
  'medication',
  'exercise',
  'monitoring',
  'appointment',
  'lifestyle'
]);

// Risk Level Schema
export const riskLevelSchema = z.enum(['low', 'medium', 'high']);

// Complexity Level Schema
export const complexityLevelSchema = z.enum(['low', 'moderate', 'high']);

// Literacy Level Schema
export const literacyLevelSchema = z.enum(['basic', 'intermediate', 'advanced']);

// Timing Schema
export const timingSchema = z.object({
  frequency: z.string(),
  timeOfDay: z.array(z.string()),
  duration: z.number().optional(),
  startDay: z.number(),
  endDay: z.number()
});

// Care Step Schema
export const careStepSchema = z.object({
  stepId: z.string(),
  carePlanId: z.string(),
  description: z.string().min(10).max(500),
  medicalContext: z.string(),
  timing: timingSchema,
  category: careCategorySchema,
  instructions: z.string(),
  dependencies: z.array(z.string()),
  riskLevel: riskLevelSchema,
  complexityScore: z.number().min(0).max(100),
  plainLanguageVersion: z.string().optional(),
  metadata: z.object({
    estimatedTime: z.number(),
    requiredSupplies: z.array(z.string()),
    warningFlags: z.array(z.string())
  })
});

// Profile Schema
export const profileSchema = z.object({
  profileId: z.string(),
  name: z.string().min(2).max(100),
  age: z.number().min(0).max(120),
  gender: z.string(),
  scenarioDescription: z.string(),
  carePlanId: z.string(),
  complexityLevel: complexityLevelSchema,
  languagePreference: z.string().default('en'),
  literacyLevel: literacyLevelSchema,
  syntheticDataMarker: z.boolean(),
  tags: z.array(z.string())
});

// Explanation Request Schema
export const explanationRequestSchema = z.object({
  stepId: z.string(),
  literacyLevel: literacyLevelSchema,
  language: z.string().optional().default('en')
});

// Simplification Request Schema
export const simplificationRequestSchema = z.object({
  stepId: z.string(),
  literacyLevel: literacyLevelSchema,
  mode: z.enum(['simple', 'detailed']).optional().default('simple')
});

// Simulation Request Schema
export const simulationRequestSchema = z.object({
  carePlanId: z.string(),
  adherencePattern: z.enum(['high', 'medium', 'low']),
  timeframe: z.enum(['1week', '1month', '3months', 'full']).optional().default('full')
});

// Summary Request Schema
export const summaryRequestSchema = z.object({
  carePlanId: z.string(),
  format: z.enum(['json', 'text']).optional().default('json'),
  audience: z.enum(['doctor', 'patient', 'caregiver']).optional().default('doctor')
});

// Validation Request Schema
export const validationRequestSchema = z.object({
  content: z.string().min(1).max(5000),
  contentType: z.enum(['explanation', 'summary', 'instruction', 'general'])
});

// API Response Schema
export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional()
});

// Helper function to validate data
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors.map(e => e.message).join(', ') };
    }
    return { success: false, error: 'Validation failed' };
  }
}

// Helper to safely parse with default
export function safeValidate<T>(schema: z.ZodSchema<T>, data: unknown, fallback: T): T {
  try {
    return schema.parse(data);
  } catch {
    return fallback;
  }
}