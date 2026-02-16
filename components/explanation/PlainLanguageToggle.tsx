'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface PlainLanguageToggleProps {
  originalText: string;
  stepId: string;
}

export function PlainLanguageToggle({ originalText, stepId }: PlainLanguageToggleProps) {
  const [isPlain, setIsPlain] = useState(false);
  const [plainText, setPlainText] = useState('');
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    if (!isPlain && !plainText) {
      setLoading(true);
      try {
        const res = await fetch('/api/simplify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stepId, literacyLevel: 'basic' })
        });
        const data = await res.json();
        setPlainText(data.simplified);
      } catch (error) {
        setPlainText('Failed to simplify text.');
      } finally {
        setLoading(false);
      }
    }
    setIsPlain(!isPlain);
  };

  return (
    <div className="space-y-3">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={toggle}
        disabled={loading}
      >
        {isPlain ? 'Show Original' : 'Plain Language'}
      </Button>
      
      <p className="text-sm">
        {isPlain ? (plainText || originalText) : originalText}
      </p>
    </div>
  );
}