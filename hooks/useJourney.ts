import { useState, useEffect } from 'react';

export function useJourney(profileId: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchJourney() {
      try {
        setLoading(true);
        const res = await fetch(`/api/journey/${profileId}`);
        if (!res.ok) throw new Error('Failed to fetch journey');
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    if (profileId) {
      fetchJourney();
    }
  }, [profileId]);

  return { data, loading, error };
}