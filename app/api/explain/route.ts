// app/api/explain/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import CareStep from '@/models/CareStep';
import AICache from '@/models/AICache';
import { aiService } from '@/services/ai-service';
import { createHash } from 'crypto';

const requestSchema = z.object({
  stepId: z.string(),
  literacyLevel: z.enum(['basic', 'intermediate', 'advanced']),
  language: z.string().optional().default('en')
});

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { stepId, literacyLevel, language } = requestSchema.parse(body);

    // Create cache key
    const cacheKey = createHash('sha256')
      .update(`${stepId}-${literacyLevel}-${language}-explanation`)
      .digest('hex');

    // Check cache first
    const cached = await AICache.findOne({ 
      cacheKey,
      validUntil: { $gt: new Date() }
    });

    if (cached) {
      // Update hit count
      cached.hitCount += 1;
      await cached.save();
      
      return NextResponse.json({
        explanation: cached.response,
        cached: true,
        generatedAt: cached.createdAt,
        model: cached.model
      });
    }

    // Fetch care step
    const careStep = await CareStep.findOne({ stepId }).lean();
    
    if (!careStep) {
      return NextResponse.json(
        { error: 'Care step not found' },
        { status: 404 }
      );
    }

    // Generate explanation with AI
    const explanation = await aiService.generateExplanation(
      careStep.description,
      careStep.medicalContext,
      literacyLevel
    );

    // Cache the result (7 days)
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 7);

    await AICache.create({
      cacheKey,
      promptType: 'explanation',
      requestParams: { stepId, literacyLevel, language },
      response: explanation,
      model: 'llama-3.1-70b-versatile',
      tokensUsed: Math.ceil(explanation.length / 4), // Rough estimate
      validUntil,
      hitCount: 1
    });

    return NextResponse.json({
      explanation,
      cached: false,
      generatedAt: new Date(),
      model: 'llama-3.1-70b-versatile'
    });

  } catch (error: any) {
    console.error('Explanation generation error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid request data',
          details: error.errors 
        },
        { status: 400 }
      );
    }

    // Fallback explanation
    const fallbackExplanation = "This care step is an important part of your prescribed treatment plan. It has been included to support your recovery and overall health. Please follow your healthcare provider's specific instructions and reach out to them if you have any questions about this activity.";

    return NextResponse.json(
      { 
        explanation: fallbackExplanation,
        cached: false,
        fallback: true,
        error: 'AI service temporarily unavailable'
      },
      { status: 200 } // Still return 200 with fallback
    );
  }
}