import { AlertTriangle } from 'lucide-react';

export function EmergencyBanner() {
  return (
    <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
      <div className="flex items-center gap-3">
        <AlertTriangle className="w-6 h-6 text-red-600" />
        <div>
          <h3 className="font-bold text-red-900">Emergency</h3>
          <p className="text-sm text-red-800">
            If experiencing a medical emergency, call 911 immediately.
          </p>
        </div>
      </div>
    </div>
  );
}