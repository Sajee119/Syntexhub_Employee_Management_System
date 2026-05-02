import { useState, useEffect } from 'react';
import { ArrowRight, Plus, Pencil, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { getTransfers, createTransfer, updateTransferStatus, deleteTransfer } from '../services/transferService';
import { getEmployees } from '../services/employeeService';
import { toast } from 'react-hot-toast';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

export default function Transfers() {
  const [transfers, setTransfers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ employee: '', fromDepartment: '', toDepartment: '', fromRole: '', toRole: '', reason: '' });
  const [editId, setEditId] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tfRes, empRes] = await Promise.all([
        getTransfers(),
        getEmployees({ limit: 100 })
      ]);
      setTransfers(tfRes.data);
      setEmployees(empRes.data.employees);
    } catch (err) { toast.error('Failed to load data'); } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateTransferStatus(editId, { status: form.status });
        toast.success('Transfer updated!');
      } else {
        await createTransfer(form);
        toast.success('Transfer request created!');
      }
      setShowForm(false); setForm({ employee: '', fromDepartment: '', toDepartment: '', fromRole: '', toRole: '', reason: '' }); setEditId(null); fetchData();
    } catch (err) { toast.error('Error saving transfer'); }
  };

  const handleStatusUpdate = async (id, status) => {
    try { await updateTransferStatus(id, { status }); toast.success(`Transfer ${status.toLowerCase()}!`); fetchData(); }
    catch (err) { toast.error('Error updating transfer'); }
  };

  const handleDelete = async () => {
    try { await deleteTransfer(deleteId); toast.success('Transfer deleted'); setShowDelete(false); fetchData(); }
    catch (err) { toast.error('Error deleting transfer'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2"><ArrowRight size={24} /> Employee Transfers</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> New Transfer
        </button>
      </div>

      <div className="card overflow-hidden">
        {loading ? <div className="flex justify-center p-8"><span className="animate-spin text-2xl">⟳</span></div> : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-secondary-200 dark:border-secondary-700">
                  <th className="table-header">Employee</th>
                  <th className="table-header">From</th>
                  <th className="table-header">To</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transfers.map(t => (
                  <tr key={t._id} className="border-b border-secondary-100 dark:border-secondary-700">
                    <td className="table-cell font-medium">{t.employee?.name}</td>
                    <td className="table-cell">{t.fromDepartment} ({t.fromRole})</td>
                    <td className="table-cell">{t.toDepartment} ({t.toRole})</td>
                    <td className="table-cell">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${t.status === 'Approved' ? 'bg-green-100 text-green-800' : t.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex gap-2">
                        {t.status === 'Pending' && (
                          <>
                            <button onClick={() => handleStatusUpdate(t._id, 'Approved')} className="p-1.5 text-green-600 hover:bg-green-50 rounded"><CheckCircle size={16} /></button>
                            <button onClick={() => handleStatusUpdate(t._id, 'Rejected')} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><XCircle size={16} /></button>
                          </>
                        )}
                        <button onClick={() => { setDeleteId(t._id); setShowDelete(true); }} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">New Transfer Request</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <select value={form.employee} onChange={e => {
                const emp = employees.find(em => em._id === e.target.value);
                setForm({...form, employee: e.target.value, fromDepartment: emp?.department || '', fromRole: emp?.role || '' });
              }} className="input-field" required>
                <option value="">Select Employee</option>
                {employees.map(emp => <option key={emp._id} value={emp._id}>{emp.name}</option>)}
              </select>
              <input type="text" value={form.fromDepartment} className="input-field" placeholder="From Department" disabled />
              <input type="text" value={form.fromRole} className="input-field" placeholder="From Role" disabled />
              <select value={form.toDepartment} onChange={e => setForm({...form, toDepartment: e.target.value})} className="input-field" required>
                <option value="">To Department</option>
                <option>Engineering</option><option>Design</option><option>Human Resources</option><option>Management</option><option>QA</option><option>Operations</option>
              </select>
              <select value={form.toRole} onChange={e => setForm({...form, toRole: e.target.value})} className="input-field" required>
                <option value="">To Role</option>
                <option>Developer</option><option>Designer</option><option>Manager</option><option>HR</option><option>Tester</option><option>DevOps</option>
              </select>
              <textarea placeholder="Reason for transfer" value={form.reason} onChange={e => setForm({...form, reason: e.target.value})} className="input-field" required rows="3" />
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <DeleteConfirmationModal isOpen={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete} itemName="this transfer" />
    </div>
  );
}
