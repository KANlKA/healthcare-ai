import { useState, useEffect } from 'react';

export function useProfile(profileId: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const res = await fetch(`/api/profiles/${profileId}`);
        if (!res.ok) throw new Error('Failed to fetch profile');
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    if (profileId) {
      fetchProfile();
    }
  }, [profileId]);

  return { data, loading, error, refetch: () => setLoading(true) };
}