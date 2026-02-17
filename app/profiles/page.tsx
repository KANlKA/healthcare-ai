// app/profiles/page.tsx
export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';
import { ProfilesFilter } from '@/components/profile/ProfilesFilter';

async function getProfiles() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/profiles`, {
    next: { revalidate: 3600 }
  });

  if (!res.ok) throw new Error('Failed to fetch profiles');
  return res.json();
}

function ProfilesLoading() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="h-64 w-full rounded-lg" />
      ))}
    </div>
  );
}

async function ProfilesList() {
  const data = await getProfiles();
  const profiles = data.profiles || [];

  if (profiles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No profiles available</p>
      </div>
    );
  }

  return <ProfilesFilter profiles={profiles} />;
}

export default function ProfilesPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Synthetic Patient Profiles</h1>
        <p className="text-gray-600">
          Select a profile to explore their care journey
        </p>
      </div>

      {/* Profiles Grid with Filter */}
      <Suspense fallback={<ProfilesLoading />}>
        <ProfilesList />
      </Suspense>
    </div>
  );
}
