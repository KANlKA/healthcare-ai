import { Clock } from 'lucide-react';

interface TimingInfoProps {
  frequency: string;
  timeOfDay: string[];
}

export function TimingInfo({ frequency, timeOfDay }: TimingInfoProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <Clock className="w-4 h-4" />
      <span>{frequency}</span>
      {timeOfDay.length > 0 && (
        <>
          <span>•</span>
          <span>{timeOfDay.join(', ')}</span>
        </>
      )}
    </div>
  );
}