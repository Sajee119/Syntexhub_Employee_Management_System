import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle, XCircle, Clock, Download, UserPlus, TrendingUp } from 'lucide-react';
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, ResponsiveContainer } from 'recharts';
import { getAttendance, markAttendance, checkout, generateReport } from '../services/attendanceService';
import { getEmployees } from '../services/employeeService';
import { toast } from 'react-hot-toast';

export default function Attendance() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedEmp, setSelectedEmp] = useState('');
  const [showQuickMark, setShowQuickMark] = useState(false);
  const [quickMarkEmp, setQuickMarkEmp] = useState('');
  const [quickMarkStatus, setQuickMarkStatus] = useState('Present');
  const [reportMonth, setReportMonth] = useState(new Date().getMonth() + 1);
  const [reportYear, setReportYear] = useState(new Date().getFullYear());
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [attendanceTrend, setAttendanceTrend] = useState([]);

  useEffect(() => { fetchData(); }, [selectedDate, selectedEmp]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = { date: selectedDate };
      if (selectedEmp) params.employeeId = selectedEmp;
      
      const [attRes, empRes] = await Promise.all([
        getAttendance(params),
        getEmployees({ limit: 100 })
      ]);
      
      setRecords(attRes.data);
      setEmployees(empRes.data.employees);
      
      // Generate trend data for the last 7 days
      const trendData = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const dayRecords = attRes.data.filter(r => {
          const rDate = new Date(r.date).toISOString().split('T')[0];
          return rDate === dateStr;
        });
        trendData.push({
          date: d.toLocaleDateString('default', { month: 'short', day: 'numeric' }),
          present: dayRecords.filter(r => r.status === 'Present').length,
          absent: dayRecords.filter(r => r.status === 'Absent').length,
          late: dayRecords.filter(r => r.status === 'Late').length
        });
      }
      setAttendanceTrend(trendData);
    } catch (err) {
      toast.error('Failed to load data');
    } finally { setLoading(false); }
  };

  const handleMark = async (employeeId, status) => {
    try {
      await markAttendance({ employeeId, status });
      toast.success('Attendance marked!');
      fetchData();
    } catch (err) { toast.error('Failed to mark attendance'); }
  };

  const handleQuickMark = async (e) => {
    e.preventDefault();
    if (!quickMarkEmp) return toast.error('Please select an employee');
    await handleMark(quickMarkEmp, quickMarkStatus);
    setShowQuickMark(false);
    setQuickMarkEmp('');
  };

  const handleCheckout = async (id) => {
    try {
      await checkout(id);
      toast.success('Checked out!');
      fetchData();
    } catch (err) { toast.error('Failed to checkout'); }
  };

  const getStatusColor = (status) => {
    const colors = { 
      'Present': 'bg-green-100 text-green-800', 
      'Absent': 'bg-red-100 text-red-800', 
      'Late': 'bg-yellow-100 text-yellow-800', 
      'Half Day': 'bg-blue-100 text-blue-800' 
    };
    return colors[status] || 'bg-gray-100';
  };

  const getStatusCount = (status) => records.filter(r => r.status === status).length;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const empId = params.get('employee');
    if (empId) {
      setSelectedEmp(empId);
    }
  }, []);

  const handleViewEmployee = (employeeId) => {
    navigate(`/attendance?employee=${employeeId}`);
    setSelectedEmp(employeeId);
    fetchData();
  };

  const handleDownloadReport = async () => {
    try {
      const res = await generateReport({ month: reportMonth, year: reportYear });
      const report = res.data.report;
      
      const headers = ['Employee', 'Email', 'Department', 'Date', 'Check In', 'Check Out', 'Status'];
      const rows = report.map(r => [r.employeeName, r.email, r.department, r.date, r.checkIn, r.checkOut, r.status]);
      const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance-report-${reportMonth}-${reportYear}.csv`;
      a.click();
      toast.success('Report downloaded!');
    } catch (err) { toast.error('Failed to generate report'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Calendar size={24} /> Attendance</h1>
        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            <select value={reportMonth} onChange={e => setReportMonth(e.target.value)} className="input-field w-auto text-sm">
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i + 1}>{new Date(2024, i).toLocaleString('default', { month: 'long' })}</option>
              ))}
            </select>
            <select value={reportYear} onChange={e => setReportYear(e.target.value)} className="input-field w-auto text-sm">
              {[2024, 2025, 2026].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <button onClick={handleDownloadReport} className="btn-secondary flex items-center gap-2 text-sm">
              <Download size={16} /> Download Report
            </button>
          </div>
          <button onClick={() => setShowQuickMark(true)} className="btn-primary flex items-center gap-2">
            <UserPlus size={18} /> Quick Mark
          </button>
        </div>
      </div>
      
      {/* Attendance Trend Graph */}
      <div className="card mb-6">
        <h2 className="font-semibold mb-4 flex items-center gap-2"><TrendingUp size={18} /> Attendance Trend (Last 7 Days)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={attendanceTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="present" stroke="#10b981" name="Present" />
            <Line type="monotone" dataKey="absent" stroke="#ef4444" name="Absent" />
            <Line type="monotone" dataKey="late" stroke="#f59e0b" name="Late" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Present', count: getStatusCount('Present'), color: 'bg-green-500' },
          { label: 'Absent', count: getStatusCount('Absent'), color: 'bg-red-500' },
          { label: 'Late', count: getStatusCount('Late'), color: 'bg-yellow-500' },
          { label: 'Half Day', count: getStatusCount('Half Day'), color: 'bg-blue-500' }
        ].map((stat, i) => (
          <div key={i} className="card flex items-center gap-3 py-3 px-4">
            <div className={`${stat.color} w-3 h-3 rounded-full`}></div>
            <div>
              <p className="text-sm text-secondary-500">{stat.label}</p>
              <p className="font-bold">{stat.count}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card mb-6">
        <div className="flex flex-wrap gap-4">
          <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="input-field w-auto" />
          <select value={selectedEmp} onChange={e => setSelectedEmp(e.target.value)} className="input-field w-auto">
            <option value="">All Employees</option>
            {employees.map(emp => <option key={emp._id} value={emp._id}>{emp.name}</option>)}
          </select>
          <button onClick={fetchData} className="btn-primary">Filter</button>
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? <div className="flex justify-center p-8"><span className="animate-spin text-2xl">⟳</span></div> : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-secondary-200 dark:border-secondary-700">
                  <th className="table-header">Employee</th>
                  <th className="table-header">Date</th>
                  <th className="table-header">Check In</th>
                  <th className="table-header">Check Out</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.length === 0 ? (
                  <tr><td colSpan="6" className="table-cell text-center py-8 text-secondary-500">No attendance records found</td></tr>
                ) : records.map(r => (
                  <tr key={r._id} className="border-b border-secondary-100 dark:border-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-700/50">
                    <td className="table-cell font-medium">
                      <button onClick={() => r.employee?._id && handleViewEmployee(r.employee._id)} 
                        className="text-left hover:text-primary-600 hover:underline">
                        {r.employee?.name || 'Unknown'}
                      </button>
                    </td>
                    <td className="table-cell">{new Date(r.date).toLocaleDateString()}</td>
                    <td className="table-cell">{r.checkIn ? new Date(r.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                    <td className="table-cell">{r.checkOut ? new Date(r.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                    <td className="table-cell">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(r.status)}`}>{r.status}</span>
                    </td>
                    <td className="table-cell">
                      <div className="flex gap-2 flex-wrap">
                        {!r.checkOut && r.checkIn && (
                          <button onClick={() => handleCheckout(r._id)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Check Out"><Clock size={16} /></button>
                        )}
                        {['Present', 'Absent', 'Late', 'Half Day'].map(s => (
                          <button key={s} onClick={() => r.employee?._id && handleMark(r.employee._id, s)} 
                            className={`px-2 py-1 text-xs rounded transition-colors ${r.status === s ? 'bg-primary-600 text-white' : 'bg-secondary-100 hover:bg-secondary-200'}`}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Mark Modal */}
      {showQuickMark && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Quick Mark Attendance</h3>
              <button onClick={() => setShowQuickMark(false)}><XCircle size={20} /></button>
            </div>
            <form onSubmit={handleQuickMark} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Employee</label>
                <select value={quickMarkEmp} onChange={e => setQuickMarkEmp(e.target.value)} className="input-field" required>
                  <option value="">Select Employee</option>
                  {employees.map(emp => <option key={emp._id} value={emp._id}>{emp.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <div className="flex gap-2">
                  {['Present', 'Absent', 'Late', 'Half Day'].map(s => (
                    <button key={s} type="button" onClick={() => setQuickMarkStatus(s)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${quickMarkStatus === s ? 'bg-primary-600 text-white' : 'bg-secondary-100 hover:bg-secondary-200'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowQuickMark(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Mark Attendance</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
