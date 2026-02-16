export function GraphLegend() {
  const items = [
    { color: 'bg-red-100 border-red-500', label: 'High Risk' },
    { color: 'bg-yellow-100 border-yellow-500', label: 'Medium Risk' },
    { color: 'bg-green-100 border-green-500', label: 'Low Risk' },
    { color: 'border-red-500', label: 'Required Dependency', isLine: true },
    { color: 'border-gray-400', label: 'Optional', isLine: true }
  ];

  return (
    <div className="flex gap-4 text-xs p-4 bg-gray-50 rounded-lg">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          {item.isLine ? (
            <div className={`w-8 h-0.5 ${item.color}`} />
          ) : (
            <div className={`w-4 h-4 rounded border-2 ${item.color}`} />
          )}
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}