import { Badge } from '@/components/ui/badge';

interface CategoryBadgeProps {
  category: string;
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  const colors: Record<string, string> = {
    medication: 'bg-blue-100 text-blue-800',
    exercise: 'bg-purple-100 text-purple-800',
    monitoring: 'bg-orange-100 text-orange-800',
    appointment: 'bg-pink-100 text-pink-800',
    lifestyle: 'bg-teal-100 text-teal-800'
  };

  return (
    <Badge className={colors[category] || 'bg-gray-100 text-gray-800'}>
      {category}
    </Badge>
  );
}