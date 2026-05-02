import { WifiOff, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function NetworkError() {
  const [retrying, setRetrying] = useState(false);

  const handleRetry = () => {
    setRetrying(true);
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 dark:bg-secondary-900 px-4">
      <div className="card max-w-md w-full text-center">
        <div className="mb-6">
          <WifiOff size={64} className="mx-auto text-red-500 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Connection Failed</h1>
          <p className="text-secondary-500">Unable to connect to the server. Please check if the backend is running.</p>
        </div>
        <button onClick={handleRetry} disabled={retrying} className="btn-primary w-full flex items-center justify-center gap-2">
          {retrying ? <span className="animate-spin">⟳</span> : <RefreshCw size={18} />}
          {retrying ? 'Retrying...' : 'Retry Connection'}
        </button>
        <p className="mt-4 text-sm text-secondary-400">Make sure to run the backend server on port 5000</p>
      </div>
    </div>
  );
}
