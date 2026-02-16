import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RiskBadge } from '@/components/risk/RiskBadge';

interface CareStepCardProps {
  step: {
    stepId: string;
    description: string;
    category: string;
    riskLevel: 'low' | 'medium' | 'high';
    timing: { frequency: string };
  };
  onClick?: () => void;
}

export function CareStepCard({ step, onClick }: CareStepCardProps) {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-medium">{step.description}</h3>
          <RiskBadge level={step.riskLevel} />
        </div>
        <div className="flex gap-2 text-sm">
          <Badge variant="outline">{step.category}</Badge>
          <Badge variant="secondary">{step.timing.frequency}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}