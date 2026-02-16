import { AlertTriangle } from 'lucide-react';

export function DisclaimerBanner() {
  return (
    <div className="bg-yellow-50 border-b border-yellow-200">
      <div className="container mx-auto px-4 py-2 flex items-center gap-2 text-sm">
        <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
        <p className="text-yellow-800">
          <strong>Educational Tool Only</strong> - Not for diagnosis or treatment. 
          Always consult qualified healthcare providers.
        </p>
      </div>
    </div>
  );
}