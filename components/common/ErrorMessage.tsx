import { AlertTriangle } from 'lucide-react';

export function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex gap-3">
        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
        <p className="text-sm text-red-900">{message}</p>
      </div>
    </div>
  );
}