import { useState, useEffect } from 'react';
import { CalendarPlus, CheckCircle, XCircle, Clock, FileText } from 'lucide-react';
import { getLeaves, applyLeave, updateLeaveStatus, deleteLeave } from '../services/leaveService';
import { getEmployees } from '../services/employeeService';
import { toast } from 'react-hot-toast';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

export default function LeaveManagement() {
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [form, setForm] = useState({ employeeId: '', type: 'Sick', startDate: '', endDate: '', reason: '' });

  useEffect(() => { fetchData(); }, [statusFilter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      
      const [leaveRes, empRes] = await Promise.all([
        getLeaves(params),
        getEmployees({ limit: 100 })
      ]);
      
      setLeaves(leaveRes.data);
      setEmployees(empRes.data.employees);
    } catch (err) { toast.error('Failed to load data'); } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await applyLeave(form);
      toast.success('Leave applied!');
      setShowForm(false);
      setForm({ employeeId: '', type: 'Sick', startDate: '', endDate: '', reason: '' });
      fetchData();
    } catch (err) { toast.error('Failed to apply leave'); }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateLeaveStatus(id, { status });
      toast.success(`Leave ${status.toLowerCase()}!`);
      fetchData();
    } catch (err) { toast.error('Failed to update leave'); }
  };

  const handleDelete = async () => {
    try {
      await deleteLeave(deleteId);
      toast.success('Leave deleted!');
      setShowDelete(false);
      fetchData();
    } catch (err) { toast.error('Failed to delete leave'); }
  };

  const getStatusColor = (status) => {
    const colors = { 'Pending': 'bg-yellow-100 text-yellow-800', 'Approved': 'bg-green-100 text-green-800', 'Rejected': 'bg-red-100 text-red-800' };
    return colors[status] || 'bg-gray-100';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2"><CalendarPlus size={24} /> Leave Management</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <CalendarPlus size={18} /> Apply Leave
        </button>
      </div>

      <div className="card mb-6">
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-field w-auto">
          <option value="">All Status</option>
          <option>Pending</option><option>Approved</option><option>Rejected</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        {loading ? <div className="flex justify-center p-8"><span className="animate-spin text-2xl">⟳</span></div> : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-secondary-200 dark:border-secondary-700">
                  <th className="table-header">Employee</th>
                  <th className="table-header">Type</th>
                  <th className="table-header">Start Date</th>
                  <th className="table-header">End Date</th>
                  <th className="table-header">Reason</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map(l => (
                  <tr key={l._id} className="border-b border-secondary-100 dark:border-secondary-700">
                    <td className="table-cell">{l.employee?.name || 'Unknown'}</td>
                    <td className="table-cell">{l.type}</td>
                    <td className="table-cell">{new Date(l.startDate).toLocaleDateString()}</td>
                    <td className="table-cell">{new Date(l.endDate).toLocaleDateString()}</td>
                    <td className="table-cell">{l.reason}</td>
                    <td className="table-cell">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(l.status)}`}>{l.status}</span>
                    </td>
                    <td className="table-cell">
                      <div className="flex gap-2">
                        {l.status === 'Pending' && (
                          <>
                            <button onClick={() => handleStatusUpdate(l._id, 'Approved')} className="p-1.5 text-green-600 hover:bg-green-50 rounded"><CheckCircle size={16} /></button>
                            <button onClick={() => handleStatusUpdate(l._id, 'Rejected')} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><XCircle size={16} /></button>
                          </>
                        )}
                        <button onClick={() => { setDeleteId(l._id); setShowDelete(true); }} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><XCircle size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Apply Leave Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Apply for Leave</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <select value={form.employeeId} onChange={e => setForm({...form, employeeId: e.target.value})} className="input-field" required>
                <option value="">Select Employee</option>
                {employees.map(emp => <option key={emp._id} value={emp._id}>{emp.name}</option>)}
              </select>
              <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="input-field">
                <option>Sick</option><option>Casual</option><option>Annual</option><option>Maternity</option><option>Paternity</option><option>Unpaid</option>
              </select>
              <input type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} className="input-field" required />
              <input type="date" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} className="input-field" required />
              <textarea placeholder="Reason" value={form.reason} onChange={e => setForm({...form, reason: e.target.value})} className="input-field" required />
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Apply</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DeleteConfirmationModal isOpen={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete} itemName="this leave request" />
    </div>
  );
}
