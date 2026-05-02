import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Pencil, Trash2, Download, ArrowUpDown, Mail, FileText, CheckSquare, Square, ChevronDown } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee, bulkDeleteEmployees, bulkUpdateStatus, sendEmployeeEmail } from '../services/employeeService';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { useNavigate } from 'react-router-dom';

export default function EmployeeManagement() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [loading, setLoading] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: '', department: '', salary: '', status: 'Active' });
  const [editId, setEditId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showBulkStatus, setShowBulkStatus] = useState(false);
  const [bulkStatus, setBulkStatus] = useState('Active');

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const params = { page, limit, search, role, status, sortBy, order };
      if (salaryMin) params.salaryMin = salaryMin;
      if (salaryMax) params.salaryMax = salaryMax;
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;
      const res = await getEmployees(params);
      setEmployees(res.data.employees);
      setTotal(res.data.total);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchEmployees(); }, [page, role, status, sortBy, order]);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchEmployees(); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) { await updateEmployee(editId, form); toast.success('Employee updated!'); }
      else { await createEmployee(form); toast.success('Employee added!'); }
      setShowForm(false); setForm({ name: '', email: '', role: '', department: '', salary: '', status: 'Active' }); setEditId(null);
      fetchEmployees();
    } catch (err) { toast.error(err.response?.data?.message || 'Error saving employee'); }
  };

  const handleEdit = (emp) => {
    setForm({ name: emp.name, email: emp.email, role: emp.role, department: emp.department, salary: emp.salary, status: emp.status });
    setEditId(emp._id); setShowForm(true);
  };

  const handleDelete = async () => {
    try { await deleteEmployee(selectedId); toast.success('Employee deleted!'); setShowDelete(false); fetchEmployees(); }
    catch (err) { toast.error('Error deleting employee'); }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return toast.error('No employees selected');
    if (!confirm(`Delete ${selectedIds.length} employees?`)) return;
    try { await bulkDeleteEmployees({ ids: selectedIds }); toast.success(`${selectedIds.length} employees deleted!`); setSelectedIds([]); fetchEmployees(); }
    catch (err) { toast.error('Error deleting employees'); }
  };

  const handleBulkStatusUpdate = async () => {
    if (selectedIds.length === 0) return toast.error('No employees selected');
    try { await bulkUpdateStatus({ ids: selectedIds, status: bulkStatus }); toast.success(`${selectedIds.length} employees updated to ${bulkStatus}!`); setSelectedIds([]); setShowBulkStatus(false); fetchEmployees(); }
    catch (err) { toast.error('Error updating employees'); }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    setSelectedIds(prev => prev.length === employees.length ? [] : employees.map(e => e._id));
  };

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Role', 'Department', 'Salary', 'Status'];
    const rows = employees.map(e => [e.name, e.email, e.role, e.department, e.salary, e.status]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'employees.csv'; a.click();
  };

  const toggleSort = (field) => {
    if (sortBy === field) setOrder(order === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setOrder('asc'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Employee Management</h1>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="btn-secondary flex items-center gap-2"><Download size={18} /> Export</button>
          <button onClick={() => { setForm({ name: '', email: '', role: '', department: '', salary: '', status: 'Active' }); setEditId(null); setShowForm(true); }} className="btn-primary flex items-center gap-2">
            <Plus size={18} /> Add Employee
          </button>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <div className="card mb-4 bg-primary-50 dark:bg-primary-900/20 border-primary-200">
          <div className="flex items-center justify-between">
            <span className="font-medium">{selectedIds.length} selected</span>
            <div className="flex gap-2">
              <button onClick={() => setShowBulkStatus(true)} className="btn-secondary text-sm flex items-center gap-1"><CheckSquare size={14} /> Bulk Status</button>
              <button onClick={handleBulkDelete} className="btn-danger text-sm flex items-center gap-1"><Trash2 size={14} /> Bulk Delete</button>
              <button onClick={() => setSelectedIds([])} className="text-sm text-secondary-500">Clear</button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card mb-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
                <input type="text" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10" />
              </div>
            </div>
            <select value={role} onChange={e => setRole(e.target.value)} className="input-field w-auto">
              <option value="">All Roles</option>
              <option>Developer</option><option>Designer</option><option>Manager</option><option>HR</option><option>Tester</option><option>DevOps</option>
            </select>
            <select value={status} onChange={e => setStatus(e.target.value)} className="input-field w-auto">
              <option value="">All Status</option>
              <option>Active</option><option>Inactive</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-4">
            <input type="number" placeholder="Min Salary" value={salaryMin} onChange={e => setSalaryMin(e.target.value)} className="input-field w-32" />
            <input type="number" placeholder="Max Salary" value={salaryMax} onChange={e => setSalaryMax(e.target.value)} className="input-field w-32" />
            <input type="date" placeholder="From" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="input-field w-auto" />
            <input type="date" placeholder="To" value={dateTo} onChange={e => setDateTo(e.target.value)} className="input-field w-auto" />
            <button type="submit" className="btn-primary">Filter</button>
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? <div className="flex justify-center p-8"><span className="animate-spin text-2xl">⟳</span></div> : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondary-200 dark:border-secondary-700">
                    <th className="table-header w-10"><button onClick={toggleSelectAll}>{selectedIds.length === employees.length ? <CheckSquare size={16} /> : <Square size={16} />}</button></th>
                    <th className="table-header cursor-pointer" onClick={() => toggleSort('name')}>Name <ArrowUpDown size={14} className="inline" /></th>
                    <th className="table-header">Email</th>
                    <th className="table-header cursor-pointer" onClick={() => toggleSort('role')}>Role <ArrowUpDown size={14} className="inline" /></th>
                    <th className="table-header">Department</th>
                    <th className="table-header cursor-pointer" onClick={() => toggleSort('salary')}>Salary <ArrowUpDown size={14} className="inline" /></th>
                    <th className="table-header">Status</th>
                    <th className="table-header">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map(emp => (
                    <tr key={emp._id} className="border-b border-secondary-100 dark:border-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-700/50">
                      <td className="table-cell"><button onClick={() => toggleSelect(emp._id)}>{selectedIds.includes(emp._id) ? <CheckSquare size={16} className="text-primary-600" /> : <Square size={16} />}</button></td>
                      <td className="table-cell font-medium cursor-pointer hover:text-primary-600" onClick={() => navigate(`/employees/${emp._id}`)}>{emp.name}</td>
                      <td className="table-cell">{emp.email}</td>
                      <td className="table-cell">{emp.role}</td>
                      <td className="table-cell">{emp.department}</td>
                      <td className="table-cell">${emp.salary}</td>
                      <td className="table-cell">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${emp.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{emp.status}</span>
                      </td>
                      <td className="table-cell">
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(emp)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Pencil size={16} /></button>
                          <button onClick={() => { setSelectedId(emp._id); setShowDelete(true); }} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between px-6 py-4 border-t border-secondary-200 dark:border-secondary-700">
              <p className="text-sm text-secondary-500">Showing {employees.length} of {total} results</p>
              <div className="flex gap-2">
                <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="btn-secondary disabled:opacity-50">Previous</button>
                <span className="px-4 py-2 text-sm">{page}</span>
                <button disabled={page >= Math.ceil(total / limit)} onClick={() => setPage(p => p + 1)} className="btn-secondary disabled:opacity-50">Next</button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bulk Status Modal */}
      {showBulkStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-xl max-w-sm w-full p-6">
            <h3 className="font-semibold mb-4">Update Status for {selectedIds.length} employees</h3>
            <select value={bulkStatus} onChange={e => setBulkStatus(e.target.value)} className="input-field mb-4">
              <option>Active</option><option>Inactive</option>
            </select>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowBulkStatus(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleBulkStatusUpdate} className="btn-primary">Update</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">{editId ? 'Edit' : 'Add'} Employee</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-field" required />
              <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="input-field" required />
              <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="input-field" required>
                <option value="">Select Role</option>
                <option>Developer</option><option>Designer</option><option>Manager</option><option>HR</option><option>Tester</option><option>DevOps</option>
              </select>
              <select value={form.department} onChange={e => setForm({...form, department: e.target.value})} className="input-field" required>
                <option value="">Select Department</option>
                <option>Engineering</option><option>Design</option><option>Human Resources</option><option>Management</option><option>QA</option><option>Operations</option>
              </select>
              <input type="number" placeholder="Salary" value={form.salary} onChange={e => setForm({...form, salary: e.target.value})} className="input-field" required min="0" />
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="input-field">
                <option>Active</option><option>Inactive</option>
              </select>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">{editId ? 'Update' : 'Add'} Employee</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DeleteConfirmationModal isOpen={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete} itemName="this employee" />
    </div>
  );
}
