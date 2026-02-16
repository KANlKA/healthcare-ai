import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const requestSchema = z.object({
  content: z.string(),
  contentType: z.enum(['explanation', 'summary', 'instruction', 'general'])
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, contentType } = requestSchema.parse(body);

    const validation = validateContent(content, contentType);

    return NextResponse.json({
      valid: validation.valid,
      issues: validation.issues,
      sanitizedContent: validation.sanitizedContent,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Validation error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Validation failed',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

function validateContent(content: string, contentType: string) {
  const issues: string[] = [];
  let sanitizedContent = content;

  // Prohibited terms (diagnostic/prescriptive language)
  const prohibitedPatterns = [
    { pattern: /\bdiagnos(e|is|ed|ing)\b/gi, issue: 'Contains diagnostic language' },
    { pattern: /\bprescrib(e|ed|ing)\b/gi, issue: 'Contains prescriptive language' },
    { pattern: /\byou should (take|start|stop|increase|decrease)\b/gi, issue: 'Contains directive medical advice' },
    { pattern: /\bi recommend\b/gi, issue: 'Contains personal medical recommendation' },
    { pattern: /\bthis will cure\b/gi, issue: 'Contains cure claim' },
    { pattern: /\byou have (a |an )?\w+ (disease|condition|disorder)\b/gi, issue: 'Contains diagnosis' },
    { pattern: /\bconsult me instead of\b/gi, issue: 'Discourages professional consultation' },
    { pattern: /\bdon'?t (see|consult|talk to) (a |your )?doctor\b/gi, issue: 'Discourages medical consultation' }
  ];

  prohibitedPatterns.forEach(({ pattern, issue }) => {
    if (pattern.test(content)) {
      issues.push(issue);
    }
  });

  // Check for appropriate disclaimers (required for certain content types)
  if (contentType === 'explanation' || contentType === 'summary') {
    const hasDisclaimer = /healthcare provider|medical professional|qualified healthcare|consult (with |your )?doctor/i.test(content);
    
    if (!hasDisclaimer) {
      issues.push('Missing healthcare provider disclaimer');
      sanitizedContent += '\n\nAlways follow your healthcare provider\'s specific instructions and consult them with any questions or concerns.';
    }
  }

  // Check for alarmist language
  const alarmistPatterns = [
    /\b(deadly|fatal|life-threatening|emergency|critical|severe danger)\b/gi
  ];

  alarmistPatterns.forEach(pattern => {
    if (pattern.test(content)) {
      issues.push('Contains potentially alarmist language');
    }
  });

  // Check for appropriate educational framing
  if (!/(educational|information|understanding|learn|example)/i.test(content)) {
    issues.push('Lacks educational framing');
  }

  // Validate content length
  if (content.length < 20) {
    issues.push('Content too short to be meaningful');
  }

  if (content.length > 2000) {
    issues.push('Content exceeds recommended length');
  }

  return {
    valid: issues.length === 0,
    issues,
    sanitizedContent,
    warnings: issues.filter(i => i.includes('Missing') || i.includes('Lacks'))
  };
}