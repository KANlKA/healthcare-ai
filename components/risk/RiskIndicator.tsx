interface RiskIndicatorProps {
  level: 'low' | 'medium' | 'high';
  score?: number;
}

export function RiskIndicator({ level, score }: RiskIndicatorProps) {
  const colors = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500'
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${colors[level]}`}
            style={{ width: score ? `${score}%` : '100%' }}
          />
        </div>
      </div>
      <span className="text-sm font-medium capitalize">{level}</span>
    </div>
  );
}