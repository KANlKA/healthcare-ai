import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

interface ComplexityRecommendationsProps {
  recommendations: string[];
}

export function ComplexityRecommendations({ recommendations }: ComplexityRecommendationsProps) {
  if (recommendations.length === 0) return null;

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <Lightbulb className="w-5 h-5" />
          Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {recommendations.map((rec, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-blue-900">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}