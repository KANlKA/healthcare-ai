import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface RiskExplanationProps {
  consequence: string;
  mitigation: string;
}

export function RiskExplanation({ consequence, mitigation }: RiskExplanationProps) {
  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-900">
          <AlertTriangle className="w-5 h-5" />
          Risk Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-red-900">
        <div>
          <h4 className="font-semibold mb-2">Potential Impact:</h4>
          <p>{consequence}</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Mitigation:</h4>
          <p>{mitigation}</p>
        </div>
        <p className="text-xs text-red-800 border-t border-red-200 pt-3">
          This is educational information. Always follow your healthcare provider's instructions.
        </p>
      </CardContent>
    </Card>
  );
}