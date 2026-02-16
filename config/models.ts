export const AI_MODELS = {
  PRIMARY: {
    name: 'llama-3.1-70b-versatile',
    provider: 'groq',
    maxTokens: 1000,
    temperature: 0.3,
    description: 'Fast, high-quality general purpose model'
  },
  FALLBACK: {
    name: 'mixtral-8x7b-32768',
    provider: 'groq',
    maxTokens: 1000,
    temperature: 0.3,
    description: 'Alternative model with larger context'
  }
};

export const MODEL_CONFIGS = {
  EXPLANATION: {
    model: AI_MODELS.PRIMARY.name,
    maxTokens: 500,
    temperature: 0.3,
    systemPrompt: 'You are an educational healthcare assistant.'
  },
  SIMPLIFICATION: {
    model: AI_MODELS.PRIMARY.name,
    maxTokens: 400,
    temperature: 0.2,
    systemPrompt: 'Transform medical text to plain language.'
  },
  SUMMARY: {
    model: AI_MODELS.PRIMARY.name,
    maxTokens: 800,
    temperature: 0.4,
    systemPrompt: 'Generate comprehensive care plan summaries.'
  }
};

export const RATE_LIMITS = {
  GROQ: {
    requestsPerDay: 14400,
    requestsPerMinute: 10,
    tokensPerMinute: 50000
  }
};