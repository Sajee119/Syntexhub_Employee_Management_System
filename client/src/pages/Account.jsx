import { User, Mail, Shield, Calendar, Clock, AtSign, Activity, Edit3 } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Account() {
  const { user } = useContext(AuthContext);

  if (!user) return <div className="p-8 text-center">Loading...</div>;

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
  };

  const formatDate = (date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
      <div className="card">
        <div className="flex items-center gap-6 mb-8 pb-6 border-b border-secondary-200 dark:border-secondary-700">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
            {getInitials(user.name)}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-semibold">{user.name}</h2>
            <p className="text-secondary-500 mt-1">{user.email}</p>
            <div className="flex items-center gap-2 mt-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
                <Shield size={12} />
                {user.role}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                <Activity size={12} />
                Active
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 bg-secondary-50 dark:bg-secondary-700/50 rounded-lg">
            <User className="text-primary-600" size={20} />
            <div>
              <p className="text-sm text-secondary-500">Full Name</p>
              <p className="font-medium">{user.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-secondary-50 dark:bg-secondary-700/50 rounded-lg">
            <Mail className="text-primary-600" size={20} />
            <div>
              <p className="text-sm text-secondary-500">Email Address</p>
              <p className="font-medium">{user.email}</p>
            </div>
          </div>

          {user.username && (
            <div className="flex items-center gap-3 p-4 bg-secondary-50 dark:bg-secondary-700/50 rounded-lg">
              <AtSign className="text-primary-600" size={20} />
              <div>
                <p className="text-sm text-secondary-500">Username</p>
                <p className="font-medium">@{user.username}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 p-4 bg-secondary-50 dark:bg-secondary-700/50 rounded-lg">
            <Shield className="text-primary-600" size={20} />
            <div>
              <p className="text-sm text-secondary-500">Role</p>
              <p className="font-medium">{user.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-secondary-50 dark:bg-secondary-700/50 rounded-lg">
            <Calendar className="text-primary-600" size={20} />
            <div>
              <p className="text-sm text-secondary-500">Member Since</p>
              <p className="font-medium">{formatDate(user.createdAt)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-secondary-50 dark:bg-secondary-700/50 rounded-lg">
            <Clock className="text-primary-600" size={20} />
            <div>
              <p className="text-sm text-secondary-500">Last Login</p>
              <p className="font-medium">{formatDate(user.lastLogin)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-secondary-50 dark:bg-secondary-700/50 rounded-lg">
            <Edit3 className="text-primary-600" size={20} />
            <div>
              <p className="text-sm text-secondary-500">Last Updated</p>
              <p className="font-medium">{formatDate(user.updatedAt)}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-secondary-200 dark:border-secondary-700">
          <div className="flex items-center justify-between text-sm text-secondary-500">
            <span>Account ID</span>
            <span className="font-mono">{user._id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
