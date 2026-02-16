interface ComplexityFactorsProps {
  factors: {
    stepCount: number;
    dependencyDepth: number;
    concurrentActivities: number;
    frequencyVariance?: number;
  };
}

export function ComplexityFactors({ factors }: ComplexityFactorsProps) {
  const items = [
    { label: 'Total Care Steps', value: factors.stepCount },
    { label: 'Max Dependency Depth', value: factors.dependencyDepth },
    { label: 'Peak Concurrent Steps', value: factors.concurrentActivities },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {items.map((item) => (
        <div key={item.label} className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-blue-600">{item.value}</div>
          <div className="text-sm text-gray-600 mt-1">{item.label}</div>
        </div>
      ))}
    </div>
  );
}