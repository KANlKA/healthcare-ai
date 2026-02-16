import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ComplexityScoreProps {
  analysis: {
    overallScore: number;
    level: string;
    factors: any;
    breakdown: any[];
  };
  carePlan: any;
}

export function ComplexityScore({ analysis, carePlan }: ComplexityScoreProps) {
  const getColor = (level: string) => {
    if (level === 'high') return 'text-red-600';
    if (level === 'moderate') return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Overall Complexity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className={`text-6xl font-bold ${getColor(analysis.level)}`}>
              {analysis.overallScore}
            </div>
            <div className="text-xl text-gray-600 mt-2 capitalize">
              {analysis.level} Complexity
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contributing Factors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span>Total Steps:</span>
            <strong>{analysis.factors.stepCount}</strong>
          </div>
          <div className="flex justify-between">
            <span>Dependency Depth:</span>
            <strong>{analysis.factors.dependencyDepth}</strong>
          </div>
          <div className="flex justify-between">
            <span>Concurrent Activities:</span>
            <strong>{analysis.factors.concurrentActivities}</strong>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}