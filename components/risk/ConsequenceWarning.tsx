import { AlertTriangle } from 'lucide-react';

interface ConsequenceWarningProps {
  message: string;
}

export function ConsequenceWarning({ message }: ConsequenceWarningProps) {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <div className="flex gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-yellow-900">{message}</div>
      </div>
    </div>
  );
}