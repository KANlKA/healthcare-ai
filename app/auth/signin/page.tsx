'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// The new auth is handled INSIDE the onboarding flow (screen 0)
// So just redirect to onboarding if not logged in
export default function SignInPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (session) {
      // Check if onboarding done
      fetch('/api/user/onboarding')
        .then(r => r.json())
        .then(d => {
          if (d.onboardingCompleted) {
            router.push('/profiles');
          } else {
            router.push('/onboarding');
          }
        })
        .catch(() => router.push('/profiles'));
    }
  }, [session, status, router]);

  // Just redirect to onboarding — auth is embedded there
  if (status === 'unauthenticated') {
    router.push('/onboarding');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f1e]">
      <div className="text-white text-sm">Redirecting...</div>
    </div>
  );
}