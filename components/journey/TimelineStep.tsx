import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

interface TimelineStepProps {
  step: {
    stepId: string;
    description: string;
    category: string;
    timeOfDay: string[];
    riskLevel: string;
  };
  onClick: () => void;
}

export function TimelineStep({ step, onClick }: TimelineStepProps) {
  const categoryColors = {
    medication: 'bg-blue-100 text-blue-800',
    exercise: 'bg-purple-100 text-purple-800',
    monitoring: 'bg-orange-100 text-orange-800',
    appointment: 'bg-pink-100 text-pink-800',
    lifestyle: 'bg-teal-100 text-teal-800'
  };

  return (
    <Card 
      className="p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-medium mb-2">{step.description}</h4>
          <div className="flex gap-2 flex-wrap">
            <Badge className={categoryColors[step.category as keyof typeof categoryColors]}>
              {step.category}
            </Badge>
            {step.timeOfDay.map((time) => (
              <Badge key={time} variant="outline" className="text-xs">
                <Clock className="w-3 h-3 mr-1" />
                {time}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}