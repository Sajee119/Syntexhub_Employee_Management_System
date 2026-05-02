import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Pencil, Trash2, Upload, FileText, Download, X, Send, Printer, TrendingUp, Camera, Loader2, Image } from 'lucide-react';
import { getEmployee, updateEmployee, deleteEmployee, sendEmployeeEmail } from '../services/employeeService';
import { getEmployeeDocuments, uploadDocument, deleteDocument, generateSalarySlip } from '../services/documentService';
import { getAttendance } from '../services/attendanceService';
import { toast } from 'react-hot-toast';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEmail, setShowEmail] = useState(false);

  const [showDelete, setShowDelete] = useState(false);
  const [showDocUpload, setShowDocUpload] = useState(false);
  const [docForm, setDocForm] = useState({ name: '', type: 'Other', file: null });
  const [emailForm, setEmailForm] = useState({ subject: '', message: '' });
  const [salaryMonth, setSalaryMonth] = useState(new Date().toISOString().slice(0, 7));
  const [salarySlip, setSalarySlip] = useState(null);

  const [attendanceData, setAttendanceData] = useState([]);
  const salarySlipRef = useRef(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfileFile, setSelectedProfileFile] = useState(null);
  const [profilePreviewUrl, setProfilePreviewUrl] = useState('');
  const [uploadingProfile, setUploadingProfile] = useState(false);

  const handleProfileFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image (JPEG, PNG, GIF, or WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setSelectedProfileFile(file);
    setProfilePreviewUrl(URL.createObjectURL(file));
  };

  const handleProfileUpload = async () => {
    if (!selectedProfileFile) return;

    setUploadingProfile(true);
    const formData = new FormData();
    formData.append('profilePicture', selectedProfileFile);

    try {
      const res = await updateEmployee(id, formData);
      setEmployee(res.data);
      toast.success('Profile picture updated!');
      setShowProfileModal(false);
      setSelectedProfileFile(null);
      setProfilePreviewUrl('');
    } catch (err) {
      toast.error('Failed to upload profile picture');
    } finally {
      setUploadingProfile(false);
    }
  };

  const closeProfileModal = () => {
    setShowProfileModal(false);
    setSelectedProfileFile(null);
    setProfilePreviewUrl('');
  };

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `http://localhost:3001${path}`;
  };

  useEffect(() => { fetchData(); }, [id]);

  const fetchData = async () => {
    try {
      const [empRes, docsRes] = await Promise.all([getEmployee(id), getEmployeeDocuments(id)]);
      setEmployee(empRes.data);
      setDocuments(docsRes.data);
      
      // Fetch attendance data for graph
      const today = new Date();
      const month = today.getMonth() + 1;
      const year = today.getFullYear();
      const attRes = await getAttendance({ employeeId: id, month, year });
      setAttendanceData(attRes.data);
    } catch (err) {
      toast.error('Failed to load employee');
    } finally { setLoading(false); }
  };

  const handleDelete = async () => {
    try {
      await deleteEmployee(id);
      toast.success('Employee deleted');
      navigate('/employees');
    } catch (err) { toast.error('Delete failed'); }
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    try {
      await sendEmployeeEmail(id, emailForm);
      toast.success('Email sent!');
      setShowEmail(false);
    } catch (err) { toast.error('Failed to send email'); }
  };

  const handleDocUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', docForm.file);
    formData.append('name', docForm.name);
    formData.append('type', docForm.type);
    try {
      await uploadDocument(id, formData);
      toast.success('Document uploaded!');
      setShowDocUpload(false);
      fetchData();
    } catch (err) { toast.error('Upload failed'); }
  };

  const handleDeleteDoc = async (docId) => {
    try {
      await deleteDocument(docId);
      toast.success('Document deleted');
      fetchData();
    } catch (err) { toast.error('Delete failed'); }
  };

  const getMonthName = (monthNum) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];
    return months[parseInt(monthNum) - 1];
  };

  const handleSalarySlip = async () => {
    try {
      const res = await generateSalarySlip(id, { month: salaryMonth.split('-')[1], year: salaryMonth.split('-')[0] });
      setSalarySlip(res.data);
      toast.success('Salary slip generated!');
    } catch (err) { toast.error('Failed to generate slip'); }
  };

  const handleProfilePicUpload = async (file) => {
    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      const res = await updateEmployee(id, formData);
      setEmployee(res.data);
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  const handlePrintSalarySlip = () => {
    if (!salarySlipRef.current) return;
    const printContent = salarySlipRef.current.innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = `
      <html>
        <head>
          <title>Salary Slip - ${salarySlip.employee}</title>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body>
          <div class="p-8 max-w-2xl mx-auto">${printContent}</div>
        </body>
      </html>
    `;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  if (loading) return <div className="flex justify-center p-8"><span className="animate-spin text-2xl">⟳</span></div>;
  if (!employee) return <div className="p-8 text-center">Employee not found</div>;

  return (
    <div>
      <button onClick={() => navigate('/employees')} className="flex items-center gap-2 text-secondary-600 hover:text-primary-600 mb-6">
        <ArrowLeft size={18} /> Back to Employees
      </button>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="card lg:col-span-1">
          <div className="text-center mb-6">
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-full bg-primary-600 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 overflow-hidden">
                {employee.profilePicture ? (
                  <img src={`http://localhost:3001${employee.profilePicture}`} alt={employee.name} className="w-full h-full object-cover" />
                ) : (
                  employee.name.charAt(0)
                )}
              </div>
              <button
                onClick={() => setShowProfileModal(true)}
                className="absolute bottom-3 right-0 bg-primary-600 text-white p-1.5 rounded-full hover:bg-primary-700 transition-colors shadow-lg"
                title="Upload profile picture"
              >
                <Camera size={14} />
              </button>
            </div>
            <h2 className="text-xl font-bold mt-2">{employee.name}</h2>
            <p className="text-secondary-500">{employee.role}</p>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${employee.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {employee.status}
            </span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3"><Mail size={16} className="text-secondary-400" /><span className="text-sm">{employee.email}</span></div>
            <p className="text-sm"><strong>Department:</strong> {employee.department}</p>
            <p className="text-sm"><strong>Salary:</strong> ${employee.salary}</p>
            <p className="text-sm"><strong>Joined:</strong> {new Date(employee.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="flex gap-2 mt-6">
            {/* <button onClick={() => navigate(`/employees?edit=${id}`)} className="btn-primary flex-1 flex items-center justify-center gap-2"><Pencil size={16} /></button> */}
            <button onClick={() => setShowEmail(true)} className="btn-secondary flex items-center justify-center gap-2"><Send size={16} /> Email</button>
            <button onClick={() => window.print()} className="btn-secondary flex items-center justify-center gap-2"><Printer size={16} /> Print</button>
            <button onClick={() => setShowDelete(true)} className="p-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50"><Trash2 size={16} /></button>
          </div>
        </div>

          {/* Documents & Actions */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2"><FileText size={18} /> Documents</h3>
                <button onClick={() => setShowDocUpload(true)} className="btn-primary flex items-center gap-2 text-sm"><Upload size={14} /> Upload</button>
              </div>
              <div className="space-y-2">
                {documents.map(doc => (
                  <div key={doc._id} className="flex items-center justify-between p-3 bg-secondary-50 dark:bg-secondary-700/50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{doc.name}</p>
                      <p className="text-xs text-secondary-500">{doc.type} • {new Date(doc.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <a href={doc.fileUrl} target="_blank" rel="noopener" className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Download size={14} /></a>
                      <button onClick={() => handleDeleteDoc(doc._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
                {documents.length === 0 && <p className="text-center text-secondary-500 py-4">No documents uploaded</p>}
              </div>
            </div>

            <div className="card">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><TrendingUp size={18} /> Attendance (This Month)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" name="Day" />
                  <YAxis dataKey="status" name="Status" tickFormatter={(v) => ['Absent', 'Late', 'Half Day', 'Present'][v] || v} />
                  <Tooltip formatter={(value, name) => name === 'status' ? ['Absent', 'Late', 'Half Day', 'Present'][value] || value : value} />
                  <Scatter name="Attendance" data={attendanceData.map(r => ({ day: new Date(r.date).getDate(), status: ['Absent', 'Late', 'Half Day', 'Present'].indexOf(r.status), id: r._id }))} fill="#3b82f6" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <h3 className="font-semibold mb-4">Generate Salary Slip</h3>
              <div className="flex gap-3 mb-4">
                <input type="month" value={salaryMonth} onChange={e => setSalaryMonth(e.target.value)} className="input-field" />
                <button onClick={handleSalarySlip} className="btn-primary">Generate</button>
              </div>
              {salarySlip && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold">Salary Slip - {getMonthName(salarySlip.month)}, {salarySlip.year}</h4>
                    <button onClick={handlePrintSalarySlip} className="btn-secondary flex items-center gap-2 text-sm">
                      <Printer size={14} /> Print Slip
                    </button>
                  </div>
                  <div ref={salarySlipRef} className="p-6 bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-lg space-y-4">
                    <div className="text-center border-b border-secondary-200 dark:border-secondary-700 pb-4">
                      <h5 className="text-xl font-bold text-primary-600">Employee Management System</h5>
                      <p className="text-sm text-secondary-500">Salary Slip for {getMonthName(salarySlip.month)}, {salarySlip.year}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-secondary-500">Employee Name</p>
                        <p className="font-semibold">{salarySlip.employee}</p>
                      </div>
                      <div>
                        <p className="text-sm text-secondary-500">Email</p>
                        <p className="font-semibold">{salarySlip.email}</p>
                      </div>
                    </div>
                    <div className="border-t border-secondary-200 dark:border-secondary-700 pt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-secondary-500">Gross Salary</p>
                          <p className="text-xl font-bold text-green-600">${salarySlip.salary}</p>
                        </div>
                        <div>
                          <p className="text-sm text-secondary-500">Deductions (10%)</p>
                          <p className="text-xl font-bold text-red-600">-${salarySlip.deductions}</p>
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-secondary-200 dark:border-secondary-700 pt-4">
                      <div className="text-center">
                        <p className="text-sm text-secondary-500">Net Pay</p>
                        <p className="text-3xl font-bold text-primary-600">${salarySlip.netPay}</p>
                      </div>
                    </div>
                    <div className="text-center text-xs text-secondary-400 border-t border-secondary-200 dark:border-secondary-700 pt-4">
                      <p>This is a computer-generated salary slip and does not require a signature.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
      </div>

      {/* Email Modal */}
      {showEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4"><h3 className="font-semibold">Send Email</h3><button onClick={() => setShowEmail(false)}><X size={20} /></button></div>
            <form onSubmit={handleSendEmail} className="space-y-4">
              <input type="text" placeholder="Subject" value={emailForm.subject} onChange={e => setEmailForm({...emailForm, subject: e.target.value})} className="input-field" required />
              <textarea placeholder="Message" value={emailForm.message} onChange={e => setEmailForm({...emailForm, message: e.target.value})} className="input-field min-h-[100px]" required />
              <div className="flex justify-end gap-3"><button type="button" onClick={() => setShowEmail(false)} className="btn-secondary">Cancel</button><button type="submit" className="btn-primary">Send</button></div>
            </form>
          </div>
        </div>
      )}

      {/* Document Upload Modal */}
      {showDocUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4"><h3 className="font-semibold">Upload Document</h3><button onClick={() => setShowDocUpload(false)}><X size={20} /></button></div>
            <form onSubmit={handleDocUpload} className="space-y-4">
              <input type="text" placeholder="Document Name" value={docForm.name} onChange={e => setDocForm({...docForm, name: e.target.value})} className="input-field" required />
              <select value={docForm.type} onChange={e => setDocForm({...docForm, type: e.target.value})} className="input-field">
                <option value="ID">ID</option><option value="Certificate">Certificate</option><option value="Contract">Contract</option><option value="Payslip">Payslip</option><option value="Other">Other</option>
              </select>
              <input type="file" onChange={e => setDocForm({...docForm, file: e.target.files[0]})} className="input-field" required />
              <div className="flex justify-end gap-3"><button type="button" onClick={() => setShowDocUpload(false)} className="btn-secondary">Cancel</button><button type="submit" className="btn-primary">Upload</button></div>
            </form>
          </div>
        </div>
      )}

      {/* Profile Picture Upload Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Update Profile Picture</h3>
              <button onClick={closeProfileModal} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                <X size={20} />
              </button>
            </div>

            <div className="mb-6">
              <div className="w-48 h-48 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 mx-auto mb-4 border-4 border-gray-300 dark:border-gray-600">
                {profilePreviewUrl ? (
                  <img src={profilePreviewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : employee?.profilePicture ? (
                  <img src={getImageUrl(employee.profilePicture)} alt={employee.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl font-bold text-gray-400">
                    {employee?.name?.charAt(0)}
                  </div>
                )}
              </div>

              <label className="block w-full cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileFileChange}
                  className="hidden"
                  id="profile-upload"
                />
                <div className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                  <Camera size={18} />
                  <span className="text-sm">{selectedProfileFile ? selectedProfileFile.name : 'Click to select an image'}</span>
                </div>
              </label>
              <p className="text-xs text-gray-400 text-center mt-2">
                Supported formats: JPEG, PNG, GIF, WebP (max 5MB)
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={closeProfileModal}
                className="btn-secondary"
                disabled={uploadingProfile}
              >
                Cancel
              </button>
              <button
                onClick={handleProfileUpload}
                disabled={!selectedProfileFile || uploadingProfile}
                className="btn-primary flex items-center gap-2"
              >
                {uploadingProfile ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Image size={16} />
                    Upload Picture
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmationModal isOpen={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete} itemName={employee.name} />
    </div>
  );
}
