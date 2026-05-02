import { AlertTriangle, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PageNotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 dark:bg-secondary-900 px-4">
      <div className="card max-w-md w-full text-center">
        <AlertTriangle size={64} className="mx-auto text-yellow-500 mb-6" />
        <h1 className="text-6xl font-bold text-secondary-300 mb-2">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-secondary-500 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <button onClick={() => navigate('/dashboard')} className="btn-primary flex items-center gap-2 mx-auto">
          <Home size={18} /> Back to Dashboard
        </button>
      </div>
    </div>
  );
}
