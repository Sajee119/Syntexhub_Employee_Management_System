import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, Loader2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';

export default function TwoFactorAuth() {
  const [passkey, setPasskey] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { verify2FA } = useContext(AuthContext);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (passkey.length !== 6) {
      toast.error('Please enter a 6-digit passkey');
      return;
    }

    setLoading(true);
    try {
      const success = await verify2FA(passkey);
      if (success) {
        toast.success('2FA verification successful!');
        navigate('/dashboard');
      } else {
        toast.error('Invalid passkey. Please try again.');
        setPasskey('');
      }
    } catch (err) {
      toast.error('Invalid passkey. Please try again.');
      setPasskey('');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    Cookies.remove('token');
    Cookies.remove('requires2FA');
    navigate('/login');
  };

  const handlePasskeyChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPasskey(value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-100 dark:from-secondary-900 dark:to-secondary-800 px-4">
      <div className="card w-full max-w-md shadow-2xl">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-secondary-600 hover:text-primary-600 mb-6"
        >
          <ArrowLeft size={18} />
          Back to Login
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">
            Two-Factor Authentication
          </h1>
          <p className="text-secondary-500">
            Enter the 6-digit passkey to continue
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-center">
              Enter 6-Digit Passkey
            </label>
            <input
              type="text"
              value={passkey}
              onChange={handlePasskeyChange}
              placeholder="000000"
              className="input-field text-center text-3xl font-bold tracking-widest py-4"
              maxLength={6}
              autoFocus
              required
            />
            <p className="text-xs text-secondary-400 text-center mt-2">
              Enter your 6-digit secret passkey
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || passkey.length !== 6}
            className="btn-primary w-full flex items-center justify-center gap-2 py-3"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <Shield size={18} />
                Verify & Sign In
              </>
            )}
          </button>
        </form>

        <div className="mt-6 p-4 bg-secondary-50 dark:bg-secondary-700/50 rounded-lg">
          <p className="text-xs text-secondary-500 text-center">
            This passkey is required for additional security. Contact your administrator if you've lost access.
          </p>
        </div>
      </div>
    </div>
  );
}
