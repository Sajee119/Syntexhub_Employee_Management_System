import { useState, useEffect } from 'react';
import { Megaphone, Plus, Pencil, Trash2 } from 'lucide-react';
import { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../services/announcementService';
import { toast } from 'react-hot-toast';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', priority: 'Medium', targetRoles: [], targetDepartments: [], expiryDate: '' });
  const [editId, setEditId] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try { const res = await getAnnouncements(); setAnnouncements(res.data); }
    catch (err) { toast.error('Failed to load announcements'); } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) { await updateAnnouncement(editId, form); toast.success('Announcement updated!'); }
      else { await createAnnouncement(form); toast.success('Announcement created!'); }
      setShowForm(false); setForm({ title: '', content: '', priority: 'Medium', targetRoles: [], targetDepartments: [], expiryDate: '' }); setEditId(null); fetchData();
    } catch (err) { toast.error('Error saving announcement'); }
  };

  const handleEdit = (ann) => { setForm({ title: ann.title, content: ann.content, priority: ann.priority, targetRoles: ann.targetRoles, targetDepartments: ann.targetDepartments, expiryDate: ann.expiryDate?.split('T')[0] || '' }); setEditId(ann._id); setShowForm(true); };

  const handleDelete = async () => { try { await deleteAnnouncement(deleteId); toast.success('Deleted'); setShowDelete(false); fetchData(); } catch (err) { toast.error('Error'); } };

  const getPriorityColor = (priority) => ({ Low: 'bg-blue-100 text-blue-800', Medium: 'bg-yellow-100 text-yellow-800', High: 'bg-red-100 text-red-800' })[priority] || 'bg-gray-100';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Megaphone size={24} /> Company Announcements</h1>
        <button onClick={() => { setForm({ title: '', content: '', priority: 'Medium', targetRoles: [], targetDepartments: [], expiryDate: '' }); setEditId(null); setShowForm(true); }} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> New Announcement
        </button>
      </div>

      <div className="space-y-4">
        {loading ? <div className="flex justify-center p-8"><span className="animate-spin text-2xl">⟳</span></div> : announcements.map(ann => (
          <div key={ann._id} className="card">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-lg">{ann.title}</h3>
              <div className="flex gap-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(ann.priority)}`}>{ann.priority}</span>
                <button onClick={() => handleEdit(ann)} className="p-1 text-blue-600"><Pencil size={14} /></button>
                <button onClick={() => { setDeleteId(ann._id); setShowDelete(true); }} className="p-1 text-red-600"><Trash2 size={14} /></button>
              </div>
            </div>
            <p className="text-secondary-600 dark:text-secondary-400 mb-3">{ann.content}</p>
            <div className="flex items-center gap-4 text-xs text-secondary-500">
              <span>By: {ann.author?.name}</span>
              <span>Published: {new Date(ann.publishDate).toLocaleDateString()}</span>
              {ann.expiryDate && <span>Expires: {new Date(ann.expiryDate).toLocaleDateString()}</span>}
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">{editId ? 'Edit' : 'New'} Announcement</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="input-field" required />
              <textarea placeholder="Content" value={form.content} onChange={e => setForm({...form, content: e.target.value})} className="input-field" rows="4" required />
              <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})} className="input-field">
                <option>Low</option><option>Medium</option><option>High</option>
              </select>
              <input type="date" placeholder="Expiry Date (optional)" value={form.expiryDate} onChange={e => setForm({...form, expiryDate: e.target.value})} className="input-field" />
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">{editId ? 'Update' : 'Publish'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <DeleteConfirmationModal isOpen={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete} itemName="this announcement" />
    </div>
  );
}
