// app/api/simplify/route.ts
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
  mode: z.enum(['simple', 'detailed']).optional().default('simple')
});

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { stepId, literacyLevel, mode } = requestSchema.parse(body);

    // Create cache key
    const cacheKey = createHash('sha256')
      .update(`${stepId}-${literacyLevel}-${mode}-simplify`)
      .digest('hex');

    // Check cache
    const cached = await AICache.findOne({ 
      cacheKey,
      validUntil: { $gt: new Date() }
    });

    if (cached) {
      cached.hitCount += 1;
      await cached.save();
      
      return NextResponse.json({
        original: JSON.parse(cached.requestParams as any).originalText,
        simplified: cached.response,
        readabilityScore: calculateReadabilityScore(cached.response),
        cached: true,
        generatedAt: cached.createdAt
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

    const originalText = mode === 'simple' 
      ? careStep.description 
      : careStep.instructions;

    // Generate plain language version
    const simplified = await aiService.generatePlainLanguage(
      originalText,
      literacyLevel
    );

    // Cache the result
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 7);

    await AICache.create({
      cacheKey,
      promptType: 'plain_language',
      requestParams: { stepId, literacyLevel, mode, originalText },
      response: simplified,
      model: 'llama-3.1-70b-versatile',
      tokensUsed: Math.ceil((originalText.length + simplified.length) / 4),
      validUntil,
      hitCount: 1
    });

    return NextResponse.json({
      original: originalText,
      simplified,
      readabilityScore: calculateReadabilityScore(simplified),
      cached: false,
      generatedAt: new Date()
    });

  } catch (error: any) {
    console.error('Simplification error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to simplify text',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

// Simple readability score calculation (Flesch Reading Ease approximation)
function calculateReadabilityScore(text: string): number {
  const words = text.split(/\s+/).length;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
  const syllables = estimateSyllables(text);
  
  if (sentences === 0 || words === 0) return 0;
  
  const avgWordsPerSentence = words / sentences;
  const avgSyllablesPerWord = syllables / words;
  
  // Flesch Reading Ease formula (simplified)
  const score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
  
  return Math.max(0, Math.min(100, Math.round(score)));
}

function estimateSyllables(text: string): number {
  const words = text.toLowerCase().split(/\s+/);
  let syllableCount = 0;
  
  words.forEach(word => {
    word = word.replace(/[^a-z]/g, '');
    if (word.length <= 3) {
      syllableCount += 1;
    } else {
      const vowels = word.match(/[aeiouy]+/g);
      syllableCount += vowels ? vowels.length : 1;
    }
  });
  
  return syllableCount;
}