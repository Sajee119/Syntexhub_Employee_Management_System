import { useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Eye, EyeOff, Shield, Users, Database, Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('admin@employeems.com');
  const [password, setPassword] = useState('qwerty123');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(email, password);
      toast.success('Login successful!');
      if (data.requires2FA) {
        navigate('/2fa');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-100 dark:from-secondary-900 dark:to-secondary-800 px-4">
      <div className="w-full max-w-lg">
        <div className="card shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-primary-600 mb-2">Welcome Back</h1>
            <p className="text-secondary-500">Sign in to Employee Management System</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-field pl-10 pr-10"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-primary-600 rounded border-secondary-300 focus:ring-primary-500"
                />
                <span className="text-sm text-secondary-600">Remember me</span>
              </label>
              <button type="button" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                Forgot password?
              </button>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
              {loading ? <span className="animate-spin">⟳</span> : <LogIn size={18} />}
              Sign In
            </button>
          </form>

          <div className="mt-6 p-4 bg-secondary-50 dark:bg-secondary-700/50 rounded-lg">
            <p className="text-xs font-medium text-secondary-500 mb-2">Demo Credentials:</p>
            <div className="space-y-1">
              <p className="text-sm"><span className="text-secondary-500">Email:</span> admin@employeems.com</p>
              <p className="text-sm"><span className="text-secondary-500">Password:</span> qwerty123</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-secondary-200 dark:border-secondary-700">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <Users className="mx-auto text-primary-600 mb-1" size={20} />
                <p className="text-xs text-secondary-500">Employee Management</p>
              </div>
              <div>
                <Database className="mx-auto text-primary-600 mb-1" size={20} />
                <p className="text-xs text-secondary-500">Secure Database</p>
              </div>
              <div>
                <Zap className="mx-auto text-primary-600 mb-1" size={20} />
                <p className="text-xs text-secondary-500">Real-Time Updates</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-secondary-500 mt-6">
          © 2026 Employee Management System. All rights reserved.
        </p>
      </div>
    </div>
  );
}
