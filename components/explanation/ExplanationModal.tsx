'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface ExplanationModalProps {
  stepId: string;
  stepDescription: string;
  onClose: () => void;
}

export function ExplanationModal({ stepId, stepDescription, onClose }: ExplanationModalProps) {
  const [explanation, setExplanation] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const fetchExplanation = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepId, literacyLevel: 'intermediate' })
      });
      const data = await res.json();
      setExplanation(data.explanation);
    } catch (error) {
      setExplanation('Failed to load explanation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Why This Exists</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm font-medium">{stepDescription}</p>
          
          {!explanation && !loading && (
            <Button onClick={fetchExplanation}>Get AI Explanation</Button>
          )}
          
          {loading && (
            <div className="flex items-center gap-2 text-gray-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating explanation...</span>
            </div>
          )}
          
          {explanation && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">{explanation}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}