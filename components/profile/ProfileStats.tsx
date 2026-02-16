interface ProfileStatsProps {
  stats: {
    totalSteps: number;
    highRiskSteps: number;
    totalDependencies: number;
    averageComplexity: number;
  };
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  const statItems = [
    { label: 'Total Steps', value: stats.totalSteps, color: 'text-blue-600' },
    { label: 'High Risk', value: stats.highRiskSteps, color: 'text-red-600' },
    { label: 'Dependencies', value: stats.totalDependencies, color: 'text-purple-600' },
    { label: 'Avg Complexity', value: stats.averageComplexity, color: 'text-orange-600' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statItems.map((stat) => (
        <div key={stat.label} className="bg-white rounded-lg p-4 text-center">
          <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
          <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}