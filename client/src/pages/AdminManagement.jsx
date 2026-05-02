import { UserCog, Plus, Pencil, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { getAdmins, createAdmin, updateAdmin, deleteAdmin } from '../services/adminService';
import { toast } from 'react-hot-toast';

const formatDateTime = (value) => {
  if (!value) return 'Never';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Never';
  return date.toLocaleString();
};

export default function AdminManagement() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Admin' });
  const [editId, setEditId] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchData(); }, [search]);

  const fetchData = async () => {
    try {
      const res = await getAdmins({ search });
      setAdmins(res.data.admins);
    } catch (err) { toast.error('Failed to load admins'); } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateAdmin(editId, form);
        toast.success('Admin updated!');
      } else {
        await createAdmin(form);
        toast.success('Admin added!');
      }
      setShowForm(false); setForm({ name: '', email: '', password: '', role: 'Admin' }); setEditId(null);
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Error saving admin'); }
  };

  const handleEdit = (admin) => { setForm({ name: admin.name, email: admin.email, password: '', role: admin.role }); setEditId(admin._id); setShowForm(true); };

  const handleDelete = async () => {
    try {
      await deleteAdmin(deleteId);
      toast.success('Admin deleted!');
      setShowDelete(false);
      fetchData();
    } catch (err) { toast.error('Error deleting admin'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2"><UserCog /> Admin Management</h1>
        <button onClick={() => { setForm({ name: '', email: '', password: '', role: 'Admin' }); setEditId(null); setShowForm(true); }} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Admin
        </button>
      </div>
      <div className="card mb-6">
        <input type="text" placeholder="Search admins..." value={search} onChange={e => setSearch(e.target.value)} className="input-field" />
      </div>
      <div className="card">
        {loading ? <div className="flex justify-center p-8"><span className="animate-spin text-2xl">⟳</span></div> : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-secondary-200 dark:border-secondary-700">
                  <th className="table-header">#</th>
                  <th className="table-header">Name</th>
                  <th className="table-header">Email</th>
                  <th className="table-header">Last Login</th>
                  <th className="table-header">Role</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin, i) => (
                  <tr key={admin._id} className="border-b border-secondary-100 dark:border-secondary-700">
                    <td className="table-cell">{i + 1}</td>
                    <td className="table-cell font-medium">{admin.name}</td>
                    <td className="table-cell">{admin.email}</td>
                    <td className="table-cell">{formatDateTime(admin.lastLogin)}</td>
                    <td className="table-cell">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${admin.role === 'Super Admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                        {admin.role}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(admin)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Pencil size={16} /></button>
                        <button onClick={() => { setDeleteId(admin._id); setShowDelete(true); }} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
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
            <h3 className="text-lg font-semibold mb-4">{editId ? 'Edit' : 'Add'} Admin</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-field" required />
              <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="input-field" required />
              <input type="password" placeholder={editId ? 'Leave blank to keep current password' : 'Password'} value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="input-field" {...(editId ? {} : { required: true })} />
              <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="input-field">
                <option>Admin</option><option>Super Admin</option>
              </select>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">{editId ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <DeleteConfirmationModal isOpen={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete} itemName="this admin" />
    </div>
  );
}
