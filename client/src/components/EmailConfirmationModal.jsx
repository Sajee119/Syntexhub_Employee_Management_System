import { Mail, X, Check } from 'lucide-react';

export default function EmailConfirmationModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-green-600 flex items-center gap-2"><Check size={18} /> Email Sent</h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <div className="text-center py-4">
          <Mail size={48} className="mx-auto text-green-500 mb-4" />
          <p className="text-secondary-600 dark:text-secondary-400">Email has been sent successfully!</p>
        </div>
        <div className="flex justify-end">
          <button onClick={onClose} className="btn-primary">OK</button>
        </div>
      </div>
    </div>
  );
}
