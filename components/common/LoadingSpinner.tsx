import { Loader2 } from 'lucide-react';

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center gap-3 py-8">
      <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
      <span className="text-sm text-gray-600">Loading...</span>
    </div>
  );
}