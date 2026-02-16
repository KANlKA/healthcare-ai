import { useState, useEffect } from 'react';

export function useRisk(stepId: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchRisk() {
      try {
        setLoading(true);
        const res = await fetch(`/api/risk/${stepId}`);
        if (!res.ok) throw new Error('Failed to fetch risk');
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    if (stepId) {
      fetchRisk();
    }
  }, [stepId]);

  return { data, loading, error };
}