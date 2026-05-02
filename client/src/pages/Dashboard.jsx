import { useEffect, useState } from 'react';
import { Users, UserCheck, UserX, TrendingUp, BarChart3, TrendingDown } from 'lucide-react';
import { getEmployees, getActivityLogs } from '../services/employeeService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import PageLoader from '../components/PageLoader';

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, avgSalary: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deptData, setDeptData] = useState([]);
  const [roleData, setRoleData] = useState([]);
  const [salaryData, setSalaryData] = useState([]);
  const [activities, setActivities] = useState([]);
  const [growthData, setGrowthData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getEmployees({ limit: 1000 });
        const employees = res.data.employees;
        const active = employees.filter(e => e.status === 'Active').length;
        const inactive = employees.filter(e => e.status === 'Inactive').length;
        const avgSalary = employees.length ? employees.reduce((sum, e) => sum + e.salary, 0) / employees.length : 0;
        setStats({ total: employees.length, active, inactive, avgSalary: Math.round(avgSalary) });
        setRecent(employees.slice(0, 5));

        const deptCounts = {};
        const roleCounts = {};
        employees.forEach(e => {
          deptCounts[e.department] = (deptCounts[e.department] || 0) + 1;
          roleCounts[e.role] = (roleCounts[e.role] || 0) + 1;
        });
        setDeptData(Object.entries(deptCounts).map(([name, value]) => ({ name, value })));
        setRoleData(Object.entries(roleCounts).map(([name, value]) => ({ name, value })));
        
        const ranges = [
          { name: '0-50K', min: 0, max: 50000 },
          { name: '50K-80K', min: 50000, max: 80000 },
          { name: '80K-100K', min: 80000, max: 100000 },
          { name: '100K+', min: 100000, max: Infinity }
        ];
        const salaryCounts = ranges.map(r => ({ 
          name: r.name, 
          count: employees.filter(e => e.salary >= r.min && e.salary < r.max).length 
        }));
        setSalaryData(salaryCounts);

        const logsRes = await getActivityLogs({ limit: 5 });
        setActivities(logsRes.data.logs);
        
        const last6Months = Array.from({ length: 6 }, (_, i) => {
          const d = new Date(); d.setMonth(d.getMonth() - (5 - i));
          return { month: d.toLocaleString('default', { month: 'short' }), year: d.getFullYear(), monthNum: d.getMonth() };
        });
        const growth = last6Months.map(({ month, year, monthNum }) => {
          const count = employees.filter(e => {
            const d = new Date(e.createdAt);
            return d.getMonth() === monthNum && d.getFullYear() === year;
          }).length;
          return { month, count };
        });
        setGrowthData(growth);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <PageLoader />;

  const cards = [
    { label: 'Total Employees', value: stats.total, icon: Users, color: 'bg-blue-500' },
    { label: 'Active', value: stats.active, icon: UserCheck, color: 'bg-green-500' },
    { label: 'Inactive', value: stats.inactive, icon: UserX, color: 'bg-red-500' },
    { label: 'Avg Salary', value: `$${stats.avgSalary}`, icon: TrendingUp, color: 'bg-purple-500' }
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, i) => (
          <div key={i} className="card flex items-center gap-4">
            <div className={`${card.color} p-3 rounded-lg text-white`}>
              <card.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-secondary-500">{card.label}</p>
              <p className="text-2xl font-bold">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><TrendingUp size={18} /> Employee Growth</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#3b82f6" name="New Employees" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 size={18} /> Employees by Department
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={deptData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" name="Employees" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Employees by Role</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={roleData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {roleData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Salary Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salaryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#10b981" name="Employees" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {activities.length === 0 ? (
              <p className="text-secondary-500">No recent activity</p>
            ) : (
              activities.map(a => (
                <div key={a._id} className="p-3 bg-secondary-50 dark:bg-secondary-700/50 rounded-lg">
                  <p className="text-sm font-medium">{a.description}</p>
                  <p className="text-xs text-secondary-500">{new Date(a.createdAt).toLocaleString()}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="card mt-6">
        <h2 className="text-lg font-semibold mb-4">Recent Employees</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-secondary-200 dark:border-secondary-700">
                <th className="table-header">Name</th>
                <th className="table-header">Email</th>
                <th className="table-header">Role</th>
                <th className="table-header">Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map(emp => (
                <tr key={emp._id} className="border-b border-secondary-100 dark:border-secondary-700">
                  <td className="table-cell">{emp.name}</td>
                  <td className="table-cell">{emp.email}</td>
                  <td className="table-cell">{emp.role}</td>
                  <td className="table-cell">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${emp.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {emp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
