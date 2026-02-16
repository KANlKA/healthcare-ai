// app/profiles/[id]/page.tsx
import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CareJourneyTimeline } from '@/components/journey/CareJourneyTimeline';
import { DependencyGraph } from '@/components/graph/DependencyGraph';
import { ComplexityScore } from '@/components/complexity/ComplexityScore';
import { ArrowLeft, Calendar, Network, BarChart3, User } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

async function getJourneyData(profileId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/journey/${profileId}`, {
    next: { revalidate: 1800 }
  });
  
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error('Failed to fetch journey data');
  }
  
  return res.json();
}

function LoadingState() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  );
}

async function JourneyContent({ profileId }: { profileId: string }) {
  const data = await getJourneyData(profileId);
  
  if (!data) {
    notFound();
  }

  const { profile, carePlan, steps, dependencies, complexityAnalysis, metadata } = data;

  return (
    <>
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                SYNTHETIC DATA
              </Badge>
              <Badge 
                variant="secondary" 
                className={
                  profile.complexityLevel === 'high' ? 'bg-red-500/20 text-white border-red-300' :
                  profile.complexityLevel === 'moderate' ? 'bg-yellow-500/20 text-white border-yellow-300' :
                  'bg-green-500/20 text-white border-green-300'
                }
              >
                {profile.complexityLevel.toUpperCase()} COMPLEXITY
              </Badge>
            </div>
            
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <User className="w-8 h-8" />
              {profile.name}
            </h1>
            
            <p className="text-lg text-blue-100">
              {profile.scenarioDescription}
            </p>
            
            <div className="flex gap-4 text-sm">
              <div>
                <span className="text-blue-200">Age:</span> <strong>{profile.age}</strong>
              </div>
              <div>
                <span className="text-blue-200">Gender:</span> <strong>{profile.gender}</strong>
              </div>
              <div>
                <span className="text-blue-200">Duration:</span> <strong>{carePlan.durationDays} days</strong>
              </div>
            </div>
          </div>
          
          <div className="text-right space-y-2">
            <div className="text-sm text-blue-100">Quick Stats</div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-2xl font-bold">{metadata.totalSteps}</div>
                <div className="text-xs text-blue-200">Steps</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-2xl font-bold">{metadata.highRiskSteps}</div>
                <div className="text-xs text-blue-200">High Risk</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="timeline" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="dependencies" className="flex items-center gap-2">
            <Network className="w-4 h-4" />
            Dependencies
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-4">
          <div className="bg-white rounded-lg border p-6">
            <CareJourneyTimeline 
              steps={steps}
              timeline={data.timeline}
              onStepClick={(stepId) => console.log('Step clicked:', stepId)}
            />
          </div>
        </TabsContent>

        <TabsContent value="dependencies" className="space-y-4">
          <div className="bg-white rounded-lg border p-6">
            <DependencyGraph 
              steps={steps}
              dependencies={dependencies}
              onNodeClick={(stepId) => console.log('Node clicked:', stepId)}
            />
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <ComplexityScore 
            analysis={complexityAnalysis}
            carePlan={carePlan}
          />
        </TabsContent>
      </Tabs>

      {/* Educational Notice */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">📚 Educational Purpose</h3>
        <p className="text-sm text-blue-800">
          This care journey is based on synthetic data for educational purposes. 
          All AI-generated explanations are designed to help understand care concepts, 
          not to provide medical advice. Always consult healthcare professionals for 
          personal medical decisions.
        </p>
      </div>
    </>
  );
}

export default function ProfilePage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Button variant="ghost" size="sm" asChild>
        <Link href="/profiles">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Profiles
        </Link>
      </Button>

      {/* Main Content */}
      <Suspense fallback={<LoadingState />}>
        <JourneyContent profileId={params.id} />
      </Suspense>
    </div>
  );
}