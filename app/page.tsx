// app/page.tsx
export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import Link from 'next/link';
import { ProfileCard } from '@/components/profile/ProfileCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Heart, Shield, Sparkles } from 'lucide-react';

async function getProfiles() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/profiles`, {
    next: { revalidate: 3600 } // Revalidate every hour
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch profiles');
  }
  
  return res.json();
}

function ProfilesLoading() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}

async function ProfilesList() {
  const data = await getProfiles();
  const profiles = data.profiles || [];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {profiles.map((profile: any) => (
        <Link key={profile.profileId} href={`/profiles/${profile.profileId}`}>
          <ProfileCard profile={profile} />
        </Link>
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
          <Sparkles className="w-4 h-4" />
          Educational Healthcare Tool
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Understand Your <span className="text-blue-600">Care Journey</span>
        </h1>
        
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          AI-powered explanations help you understand care plans with clear, 
          educational information tailored to your needs.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Button size="lg" asChild>
            <Link href="#profiles">Explore Scenarios</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/about">Learn More</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-8 py-8">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Shield className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-lg">Safety First</h3>
          <p className="text-gray-600 text-sm">
            Built with multiple guardrails to ensure safe, educational content only
          </p>
        </div>

        <div className="text-center space-y-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-lg">AI-Powered</h3>
          <p className="text-gray-600 text-sm">
            Clear explanations in plain language, adapted to your literacy level
          </p>
        </div>

        <div className="text-center space-y-3">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
            <Heart className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-lg">Synthetic Data</h3>
          <p className="text-gray-600 text-sm">
            All scenarios use fictional data for privacy and educational purposes
          </p>
        </div>
      </section>

      {/* Important Notice */}
      <section className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
        <div className="flex gap-4">
          <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
          <div className="space-y-2">
            <h3 className="font-semibold text-yellow-900">Important Notice</h3>
            <p className="text-sm text-yellow-800">
              This is an educational tool using synthetic patient data. It does not provide 
              medical advice, diagnosis, or treatment recommendations. Always consult with 
              qualified healthcare providers for medical decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Profiles Section */}
      <section id="profiles" className="space-y-6 scroll-mt-20">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Explore Care Scenarios</h2>
          <p className="text-gray-600">
            Select a synthetic patient profile to explore their care journey
          </p>
        </div>

        <Suspense fallback={<ProfilesLoading />}>
          <ProfilesList />
        </Suspense>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Learn?</h2>
        <p className="text-lg mb-6 text-blue-100">
          Explore how AI can help make healthcare more understandable
        </p>
        <Button size="lg" variant="secondary" asChild>
          <Link href="/about/how-it-works">See How It Works</Link>
        </Button>
      </section>
    </div>
  );
}