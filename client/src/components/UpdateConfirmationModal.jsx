import { Pencil, X } from 'lucide-react';

export default function UpdateConfirmationModal({ isOpen, onClose, onConfirm, itemName }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-primary-600">Confirm Update</h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <p className="text-secondary-600 dark:text-secondary-400 mb-6">
          Are you sure you want to update <span className="font-semibold">{itemName}</span>?
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={onConfirm} className="btn-primary flex items-center gap-2">
            <Pencil size={16} /> Update
          </button>
        </div>
      </div>
    </div>
  );
}
