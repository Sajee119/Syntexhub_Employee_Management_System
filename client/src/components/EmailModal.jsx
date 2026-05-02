import { Mail, X } from 'lucide-react';

export default function EmailModal({ isOpen, onClose, employee }) {
  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2"><Mail size={18} /> Send Email</h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">To</label>
            <input type="email" value={employee.email} disabled className="input-field bg-secondary-100" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Subject</label>
            <input type="text" placeholder="Email subject" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea rows="4" placeholder="Type your message..." className="input-field"></textarea>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary flex items-center gap-2">
              <Mail size={16} /> Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
