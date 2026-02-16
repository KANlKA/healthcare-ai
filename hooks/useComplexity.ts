import { useState, useEffect } from 'react';

export function useComplexity(carePlanId: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchComplexity() {
      try {
        setLoading(true);
        const res = await fetch(`/api/complexity/${carePlanId}`);
        if (!res.ok) throw new Error('Failed to fetch complexity');
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    if (carePlanId) {
      fetchComplexity();
    }
  }, [carePlanId]);

  return { data, loading, error };
}