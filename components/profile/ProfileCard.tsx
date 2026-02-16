import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface ProfileCardProps {
  profile: {
    profileId: string;
    name: string;
    age: number;
    gender: string;
    scenarioDescription: string;
    complexityLevel: string;
    tags: string[];
  };
}

export function ProfileCard({ profile }: ProfileCardProps) {
  const complexityColors = {
    low: 'bg-green-100 text-green-800',
    moderate: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg">{profile.name}</h3>
          <Badge className="bg-purple-100 text-purple-800">SYNTHETIC</Badge>
        </div>
        <Badge className={complexityColors[profile.complexityLevel as keyof typeof complexityColors]}>
          {profile.complexityLevel.toUpperCase()}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-3">{profile.scenarioDescription}</p>
        <div className="flex gap-2 text-xs text-gray-500">
          <span>Age: {profile.age}</span>
          <span>•</span>
          <span>{profile.gender}</span>
        </div>
        <div className="flex flex-wrap gap-1 mt-3">
          {profile.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}