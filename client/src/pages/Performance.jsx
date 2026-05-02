import { useState, useEffect } from 'react';
import { Star, Plus, Pencil, Trash2, TrendingUp } from 'lucide-react';
import { getReviews, createReview, updateReview, deleteReview } from '../services/performanceService';
import { getEmployees } from '../services/employeeService';
import { toast } from 'react-hot-toast';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

export default function Performance() {
  const [reviews, setReviews] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ employee: '', periodStart: '', periodEnd: '', rating: 3, goals: [''], strengths: [''], improvements: [''], comments: '' });
  const [editId, setEditId] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [revRes, empRes] = await Promise.all([
        getReviews(),
        getEmployees({ limit: 100 })
      ]);
      setReviews(revRes.data);
      setEmployees(empRes.data.employees);
    } catch (err) { toast.error('Failed to load data'); } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...form,
      period: { start: form.periodStart, end: form.periodEnd },
      goals: form.goals.filter(g => g.trim()).map(desc => ({ description: desc, achieved: false }))
    };
    delete data.periodStart; delete data.periodEnd;
    
    try {
      if (editId) {
        await updateReview(editId, data);
        toast.success('Review updated!');
      } else {
        await createReview(data);
        toast.success('Review created!');
      }
      setShowForm(false); resetForm(); fetchData();
    } catch (err) { toast.error('Error saving review'); }
  };

  const handleEdit = (review) => {
    setForm({
      employee: review.employee._id,
      periodStart: review.period.start.toISOString().split('T')[0],
      periodEnd: review.period.end.toISOString().split('T')[0],
      rating: review.rating,
      goals: review.goals.map(g => g.description),
      strengths: review.strengths,
      improvements: review.improvements,
      comments: review.comments || ''
    });
    setEditId(review._id); setShowForm(true);
  };

  const handleDelete = async () => {
    try { await deleteReview(deleteId); toast.success('Review deleted'); setShowDelete(false); fetchData(); }
    catch (err) { toast.error('Error deleting review'); }
  };

  const resetForm = () => { setForm({ employee: '', periodStart: '', periodEnd: '', rating: 3, goals: [''], strengths: [''], improvements: [''], comments: '' }); setEditId(null); };

  const addGoal = () => setForm({...form, goals: [...form.goals, '']});
  const addStrength = () => setForm({...form, strengths: [...form.strengths, '']});
  const addImprovement = () => setForm({...form, improvements: [...form.improvements, '']});

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2"><TrendingUp size={24} /> Performance Reviews</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Create Review
        </button>
      </div>

      <div className="card overflow-hidden">
        {loading ? <div className="flex justify-center p-8"><span className="animate-spin text-2xl">⟳</span></div> : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-secondary-200 dark:border-secondary-700">
                  <th className="table-header">Employee</th>
                  <th className="table-header">Period</th>
                  <th className="table-header">Rating</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map(r => (
                  <tr key={r._id} className="border-b border-secondary-100 dark:border-secondary-700">
                    <td className="table-cell font-medium">{r.employee?.name}</td>
                    <td className="table-cell">{new Date(r.period.start).toLocaleDateString()} - {new Date(r.period.end).toLocaleDateString()}</td>
                    <td className="table-cell">
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map(star => (
                          <Star key={star} size={14} className={star <= r.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'} />
                        ))}
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${r.status === 'Completed' ? 'bg-green-100 text-green-800' : r.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(r)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Pencil size={16} /></button>
                        <button onClick={() => { setDeleteId(r._id); setShowDelete(true); }} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
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
          <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">{editId ? 'Edit' : 'Create'} Performance Review</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <select value={form.employee} onChange={e => setForm({...form, employee: e.target.value})} className="input-field" required>
                <option value="">Select Employee</option>
                {employees.map(emp => <option key={emp._id} value={emp._id}>{emp.name}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-4">
                <input type="date" value={form.periodStart} onChange={e => setForm({...form, periodStart: e.target.value})} className="input-field" required placeholder="Start Date" />
                <input type="date" value={form.periodEnd} onChange={e => setForm({...form, periodEnd: e.target.value})} className="input-field" required placeholder="End Date" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Rating</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(star => (
                    <button type="button" key={star} onClick={() => setForm({...form, rating: star})}>
                      <Star size={24} className={star <= form.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Goals</label>
                {form.goals.map((goal, i) => (
                  <input key={i} type="text" value={goal} onChange={e => {
                    const newGoals = [...form.goals]; newGoals[i] = e.target.value; setForm({...form, goals: newGoals});
                  }} className="input-field mb-2" placeholder={`Goal ${i+1}`} />
                ))}
                <button type="button" onClick={addGoal} className="text-sm text-primary-600">+ Add Goal</button>
              </div>
              <textarea placeholder="Strengths (one per line)" value={form.strengths.join('\n')} onChange={e => setForm({...form, strengths: e.target.value.split('\n')})} className="input-field" rows="3" />
              <textarea placeholder="Areas for Improvement (one per line)" value={form.improvements.join('\n')} onChange={e => setForm({...form, improvements: e.target.value.split('\n')})} className="input-field" rows="3" />
              <textarea placeholder="Additional Comments" value={form.comments} onChange={e => setForm({...form, comments: e.target.value})} className="input-field" rows="3" />
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">{editId ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <DeleteConfirmationModal isOpen={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete} itemName="this review" />
    </div>
  );
}
