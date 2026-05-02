import { Loader2 } from 'lucide-react';

export default function BackendWarmupGate() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 dark:bg-secondary-900">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Connecting to server...</h2>
        <p className="text-secondary-500">Please wait while we establish connection</p>
      </div>
    </div>
  );
}
