import { Badge } from '@/components/ui/badge';

interface TimelineDayProps {
  day: number;
  stepCount: number;
  isActive: boolean;
  onClick: () => void;
}

export function TimelineDay({ day, stepCount, isActive, onClick }: TimelineDayProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg border ${
        isActive 
          ? 'bg-blue-600 text-white border-blue-600' 
          : 'bg-white border-gray-200 hover:border-blue-300'
      }`}
    >
      <div className="text-sm font-semibold">Day {day}</div>
      <div className="text-xs opacity-75">{stepCount} steps</div>
    </button>
  );
}