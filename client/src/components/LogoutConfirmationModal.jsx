import { LogOut, X } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LogoutConfirmationModal({ isOpen, onClose }) {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Confirm Logout</h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <p className="text-secondary-600 dark:text-secondary-400 mb-6">Are you sure you want to logout?</p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={handleLogout} className="btn-danger flex items-center gap-2">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}
