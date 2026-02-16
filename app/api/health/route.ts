// app/api/health/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  const health = {
    status: 'healthy' as 'healthy' | 'degraded' | 'unhealthy',
    timestamp: new Date().toISOString(),
    services: {
      database: false,
      ai: false,
      cache: false
    },
    responseTime: 0
  };

  try {
    // Check MongoDB connection
    try {
      await connectDB();
      health.services.database = mongoose.connection.readyState === 1;
    } catch (error) {
      console.error('Database health check failed:', error);
      health.services.database = false;
    }

    // Check AI service (simple check if env var exists)
    health.services.ai = !!process.env.GROQ_API_KEY;

    // Check cache (Redis or MongoDB based cache)
    health.services.cache = health.services.database; // Using MongoDB for cache

    // Determine overall status
    const servicesUp = Object.values(health.services).filter(Boolean).length;
    if (servicesUp === 3) {
      health.status = 'healthy';
    } else if (servicesUp >= 2) {
      health.status = 'degraded';
    } else {
      health.status = 'unhealthy';
    }

    health.responseTime = Date.now() - startTime;

    const statusCode = health.status === 'healthy' ? 200 : 
                       health.status === 'degraded' ? 200 : 503;

    return NextResponse.json(health, { status: statusCode });

  } catch (error: any) {
    health.status = 'unhealthy';
    health.responseTime = Date.now() - startTime;

    return NextResponse.json(
      {
        ...health,
        error: error.message
      },
      { status: 503 }
    );
  }
}