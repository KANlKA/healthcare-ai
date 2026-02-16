import { useState, useEffect } from 'react';

export function useDependencies(carePlanId: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchDependencies() {
      try {
        setLoading(true);
        // This would call a dedicated dependencies endpoint if we had one
        // For now, we get it from the journey endpoint
        const res = await fetch(`/api/journey/${carePlanId}`);
        if (!res.ok) throw new Error('Failed to fetch dependencies');
        const json = await res.json();
        setData(json.dependencies);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    if (carePlanId) {
      fetchDependencies();
    }
  }, [carePlanId]);

  return { data, loading, error };
}