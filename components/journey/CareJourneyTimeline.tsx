'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CareJourneyTimelineProps {
  steps: any[];
  timeline: any[];
  onStepClick?: (stepId: string) => void;
}

export function CareJourneyTimeline({ steps, timeline, onStepClick }: CareJourneyTimelineProps) {
  const [selectedDay, setSelectedDay] = useState(1);

  const days = timeline.map(t => t.day);
  const currentDaySteps = timeline.find(t => t.day === selectedDay)?.steps || [];

  const getRiskColor = (level: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100';
  };

  return (
    <div className="space-y-6">
      {/* Day Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {days.map((day) => (
          <Button
            key={day}
            variant={selectedDay === day ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedDay(day)}
          >
            Day {day}
          </Button>
        ))}
      </div>

      {/* Steps for Selected Day */}
      <div className="space-y-4">
        {currentDaySteps.map((step: any) => (
          <Card
            key={step.stepId}
            className="p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onStepClick?.(step.stepId)}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">{step.description}</h3>
              <Badge className={getRiskColor(step.riskLevel)}>
                {step.riskLevel}
              </Badge>
            </div>
            <div className="flex gap-2 text-sm text-gray-600">
              <Badge variant="outline">{step.category}</Badge>
              {step.timeOfDay.map((time: string) => (
                <Badge key={time} variant="secondary">{time}</Badge>
              ))}
            </div>
          </Card>
        ))}
        
        {currentDaySteps.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            No activities for this day
          </p>
        )}
      </div>
    </div>
  );
}