import Groq from "groq-sdk";

interface AIServiceConfig {
  model: string;
  maxTokens: number;
  temperature: number;
}

class AIService {
  private client: Groq | null = null;
  private config: AIServiceConfig;

  constructor() {
    this.config = {
      model: "llama-3.1-70b-versatile",
      maxTokens: 500,
      temperature: 0.3
    };
  }

  private getClient(): Groq {
    if (!this.client) {
      if (!process.env.GROQ_API_KEY) {
        throw new Error('GROQ_API_KEY is not set');
      }
      this.client = new Groq({
        apiKey: process.env.GROQ_API_KEY
      });
    }
    return this.client;
  }

  async generateExplanation(
    stepDescription: string,
    medicalContext: string,
    literacyLevel: string
  ): Promise<string> {
    const prompt = this.buildExplanationPrompt(stepDescription, medicalContext, literacyLevel);
    return await this.invokeModel(prompt);
  }

  async generatePlainLanguage(
    originalText: string,
    literacyLevel: string
  ): Promise<string> {
    const prompt = this.buildPlainLanguagePrompt(originalText, literacyLevel);
    return await this.invokeModel(prompt);
  }

  private buildExplanationPrompt(
    stepDescription: string,
    medicalContext: string,
    literacyLevel: string
  ): string {
    return `You are an educational healthcare assistant helping patients understand their existing care plan.

CRITICAL SAFETY RULES:
- Never diagnose conditions
- Never prescribe medications
- Never recommend treatments
- Never interpret symptoms
- Frame everything as educational information about existing care instructions
- Include appropriate disclaimers

TASK: Explain why this care step exists in plain language appropriate for ${literacyLevel} literacy level.

CARE STEP: ${stepDescription}

MEDICAL CONTEXT: ${medicalContext}

Provide a clear, educational explanation (2-3 sentences) focusing on:
1. The purpose of this care activity
2. How it supports the overall recovery/management
3. Why it's important to follow as prescribed

Remember: This is educational content about an existing care plan created by healthcare providers. End with: "Always follow your healthcare provider's specific instructions."`;
  }

  private buildPlainLanguagePrompt(
    originalText: string,
    literacyLevel: string
  ): string {
    const targetGrade = {
      basic: '6th-8th grade',
      intermediate: '9th-10th grade',
      advanced: '11th-12th grade'
    }[literacyLevel] || '8th grade';

    return `Transform the following medical instruction into plain language appropriate for ${targetGrade} reading level.

RULES:
- Replace medical jargon with everyday terms
- Use shorter sentences
- Break complex instructions into simple steps
- Maintain all critical safety information
- Keep the meaning identical

ORIGINAL TEXT:
${originalText}

Provide only the plain-language version, no explanations.`;
  }

  private async invokeModel(prompt: string): Promise<string> {
    try {
      const chatCompletion = await this.getClient().chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: this.config.model,
        temperature: this.config.temperature,
        max_tokens: this.config.maxTokens,
      });

      return chatCompletion.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Groq API error:', error);
      throw new Error('AI service temporarily unavailable');
    }
  }
}

export const aiService = new AIService();