interface ComplexityChartProps {
  analysis: {
    breakdown: Array<{
      category: string;
      score: number;
      description: string;
    }>;
  };
}

export function ComplexityChart({ analysis }: ComplexityChartProps) {
  return (
    <div className="space-y-4">
      {analysis.breakdown.map((item) => (
        <div key={item.category} className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">{item.category}</span>
            <span className="text-gray-600">{item.score}/100</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                item.score >= 66 ? 'bg-red-500' :
                item.score >= 33 ? 'bg-yellow-500' :
                'bg-green-500'
              }`}
              style={{ width: `${item.score}%` }}
            />
          </div>
          <p className="text-xs text-gray-600">{item.description}</p>
        </div>
      ))}
    </div>
  );
}