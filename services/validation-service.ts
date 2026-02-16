interface ValidationResult {
  valid: boolean;
  issues: string[];
  sanitizedContent: string;
  warnings: string[];
}

class ValidationService {
  validateContent(content: string, contentType: string): ValidationResult {
    const issues: string[] = [];
    const warnings: string[] = [];
    let sanitizedContent = content;

    // Prohibited terms
    const prohibitedPatterns = [
      { pattern: /\bdiagnos(e|is|ed|ing)\b/gi, issue: 'Contains diagnostic language' },
      { pattern: /\bprescrib(e|ed|ing)\b/gi, issue: 'Contains prescriptive language' },
      { pattern: /\byou should (take|start|stop|increase|decrease)\b/gi, issue: 'Contains directive medical advice' },
      { pattern: /\bi recommend\b/gi, issue: 'Contains personal medical recommendation' },
      { pattern: /\bthis will cure\b/gi, issue: 'Contains cure claim' },
      { pattern: /\byou have (a |an )?\w+ (disease|condition|disorder)\b/gi, issue: 'Contains diagnosis' }
    ];

    prohibitedPatterns.forEach(({ pattern, issue }) => {
      if (pattern.test(content)) {
        issues.push(issue);
      }
    });

    // Check for disclaimers
    if (contentType === 'explanation' || contentType === 'summary') {
      const hasDisclaimer = /healthcare provider|medical professional|qualified healthcare|consult (with |your )?doctor/i.test(content);
      
      if (!hasDisclaimer) {
        warnings.push('Missing healthcare provider disclaimer');
        sanitizedContent += '\n\nAlways follow your healthcare provider\'s specific instructions and consult them with any questions or concerns.';
      }
    }

    // Check for alarmist language
    if (/\b(deadly|fatal|life-threatening|severe danger)\b/gi.test(content)) {
      issues.push('Contains potentially alarmist language');
    }

    // Check for educational framing
    if (!/(educational|information|understanding|learn|example)/i.test(content)) {
      warnings.push('Lacks educational framing');
    }

    // Validate content length
    if (content.length < 20) {
      issues.push('Content too short to be meaningful');
    }

    if (content.length > 2000) {
      warnings.push('Content exceeds recommended length');
    }

    return {
      valid: issues.length === 0,
      issues,
      sanitizedContent,
      warnings
    };
  }
}

export const validationService = new ValidationService();