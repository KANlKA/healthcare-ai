import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Info, CheckCircle } from 'lucide-react';

interface RiskBadgeProps {
  level: 'low' | 'medium' | 'high';
  showIcon?: boolean;
}

export function RiskBadge({ level, showIcon = true }: RiskBadgeProps) {
  const config = {
    high: { 
      color: 'bg-red-100 text-red-800 border-red-300', 
      icon: AlertTriangle 
    },
    medium: { 
      color: 'bg-yellow-100 text-yellow-800 border-yellow-300', 
      icon: Info 
    },
    low: { 
      color: 'bg-green-100 text-green-800 border-green-300', 
      icon: CheckCircle 
    }
  };

  const { color, icon: Icon } = config[level];

  return (
    <Badge className={color}>
      {showIcon && <Icon className="w-3 h-3 mr-1" />}
      {level.toUpperCase()}
    </Badge>
  );
}