export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ErrorResponse {
  error: string;
  message?: string;
  statusCode?: number;
  details?: any;
}

export interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  services: {
    database: boolean;
    ai: boolean;
    cache: boolean;
  };
  responseTime: number;
}

export interface ExplanationResponse {
  explanation: string;
  cached: boolean;
  generatedAt: Date;
  model?: string;
  fallback?: boolean;
}

export interface SimplificationResponse {
  original: string;
  simplified: string;
  readabilityScore: number;
  cached: boolean;
  generatedAt: Date;
}

export interface SimulationResponse {
  carePlanId: string;
  adherencePattern: string;
  timeframe: string;
  simulation: {
    projectedDuration: number;
    adherenceRate: string;
    milestones: Array<{
      day: number;
      milestone: string;
      description: string;
      likelihood: string;
    }>;
    projectedOutcomes: Array<{
      category: string;
      projection: string;
      confidence: string;
    }>;
    keyFactors: Array<{
      factor: string;
      importance: string;
      impact: string;
    }>;
    recommendations: string[];
  };
  disclaimer: string;
  timestamp: string;
}