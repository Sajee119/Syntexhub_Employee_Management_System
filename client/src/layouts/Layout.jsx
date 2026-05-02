import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Menu, X, LayoutDashboard, Users, Building2, Shield, UserCog, User, Info, LogOut, Sun, Moon, Calendar, CalendarPlus } from 'lucide-react';
import NotificationBell from '../components/NotificationBell';
import LogoutConfirmationModal from '../components/LogoutConfirmationModal';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/employees', icon: Users, label: 'Employees' },
  { to: '/attendance', icon: Calendar, label: 'Attendance' },
  { to: '/leaves', icon: CalendarPlus, label: 'Leaves' },
  { to: '/departments', icon: Building2, label: 'Departments' },
  { to: '/roles', icon: Shield, label: 'Roles' },
  { to: '/admins', icon: UserCog, label: 'Admins' },
  { to: '/account', icon: User, label: 'Account' },
  { to: '/about', icon: Info, label: 'About' }
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [showLogout, setShowLogout] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
    document.documentElement.classList.toggle('dark', newMode);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="flex h-screen bg-secondary-50 dark:bg-secondary-900">
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-secondary-800 border-r border-secondary-200 dark:border-secondary-700 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-200 ease-in-out`}>
          <div className="flex items-center justify-between h-16 px-6 border-b border-secondary-200 dark:border-secondary-700">
            <h1 className="text-xl font-bold text-primary-600">EMS</h1>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden"><X size={20} /></button>
          </div>
          <nav className="mt-6 px-3 space-y-1">
            {navItems.map(item => (
              <NavLink key={item.to} to={item.to} onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400' : 'text-secondary-600 hover:bg-secondary-100 dark:text-secondary-400 dark:hover:bg-secondary-700'}`}>
                <item.icon size={18} />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <button onClick={() => setShowLogout(true)} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 md:ml-64 flex flex-col">
          <header className="h-16 bg-white dark:bg-secondary-800 border-b border-secondary-200 dark:border-secondary-700 flex items-center justify-between px-6">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden"><Menu size={20} /></button>
            <div className="flex items-center gap-4 ml-auto">
              <NotificationBell />
              <button onClick={toggleDarkMode} className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700">
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-medium">
                  {user?.name?.charAt(0)}
                </div>
                <span className="text-sm font-medium">{user?.name}</span>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
      <LogoutConfirmationModal isOpen={showLogout} onClose={() => setShowLogout(false)} />
    </div>
  );
}
