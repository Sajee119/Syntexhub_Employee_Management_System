import { Shield, Plus, Pencil, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { getRoles, createRole, updateRole, deleteRole } from '../services/roleService';
import { toast } from 'react-hot-toast';

export default function RoleManagement() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [editId, setEditId] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await getRoles();
      setRoles(res.data);
    } catch (err) { toast.error('Failed to load roles'); } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateRole(editId, form);
        toast.success('Role updated!');
      } else {
        await createRole(form);
        toast.success('Role added!');
      }
      setShowForm(false); setForm({ name: '', description: '' }); setEditId(null);
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Error saving role'); }
  };

  const handleEdit = (role) => { setForm({ name: role.name, description: role.description || '' }); setEditId(role._id); setShowForm(true); };

  const handleDelete = async () => {
    try {
      await deleteRole(deleteId);
      toast.success('Role deleted!');
      setShowDelete(false);
      fetchData();
    } catch (err) { toast.error('Error deleting role'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Shield /> Role Management</h1>
        <button onClick={() => { setForm({ name: '', description: '' }); setEditId(null); setShowForm(true); }} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Role
        </button>
      </div>
      <div className="card">
        {loading ? <div className="flex justify-center p-8"><span className="animate-spin text-2xl">⟳</span></div> : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-secondary-200 dark:border-secondary-700">
                  <th className="table-header">#</th>
                  <th className="table-header">Role Name</th>
                  <th className="table-header">Description</th>
                  <th className="table-header">Employees</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role, i) => (
                  <tr key={role._id} className="border-b border-secondary-100 dark:border-secondary-700">
                    <td className="table-cell">{i + 1}</td>
                    <td className="table-cell font-medium">{role.name}</td>
                    <td className="table-cell">{role.description || '-'}</td>
                    <td className="table-cell">{role.employeeCount || 0}</td>
                    <td className="table-cell">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(role)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Pencil size={16} /></button>
                        <button onClick={() => { setDeleteId(role._id); setShowDelete(true); }} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
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
            <h3 className="text-lg font-semibold mb-4">{editId ? 'Edit' : 'Add'} Role</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <select value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-field" required>
                <option value="">Select Role</option>
                <option>Developer</option><option>Designer</option><option>Manager</option><option>HR</option><option>Tester</option><option>DevOps</option>
              </select>
              <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input-field" rows="3" />
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">{editId ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <DeleteConfirmationModal isOpen={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete} itemName="this role" />
    </div>
  );
}
