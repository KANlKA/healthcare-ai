import { useState } from 'react';

export function useExplanation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getExplanation = async (stepId: string, literacyLevel: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepId, literacyLevel })
      });
      if (!res.ok) throw new Error('Failed to get explanation');
      return await res.json();
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { getExplanation, loading, error };
}