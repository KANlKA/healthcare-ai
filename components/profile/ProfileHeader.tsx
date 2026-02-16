import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';

interface ProfileHeaderProps {
  profile: {
    name: string;
    age: number;
    gender: string;
    scenarioDescription: string;
    complexityLevel: string;
  };
  carePlan: {
    durationDays: number;
  };
}

export function ProfileHeader({ profile, carePlan }: ProfileHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div className="flex gap-2">
            <Badge className="bg-white/20 text-white border-white/30">SYNTHETIC</Badge>
            <Badge className="bg-white/20 text-white border-white/30">
              {profile.complexityLevel.toUpperCase()}
            </Badge>
          </div>
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <User className="w-8 h-8" />
            {profile.name}
          </h1>
          <p className="text-lg text-blue-100">{profile.scenarioDescription}</p>
          <div className="flex gap-4 text-sm">
            <span>Age: {profile.age}</span>
            <span>•</span>
            <span>{profile.gender}</span>
            <span>•</span>
            <span>{carePlan.durationDays} days</span>
          </div>
        </div>
      </div>
    </div>
  );
}