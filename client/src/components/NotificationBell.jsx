import { useState, useEffect, useRef } from 'react';
import { Bell, CheckCheck, Trash2, X } from 'lucide-react';
import { getNotifications, markAsRead, markAllAsRead, deleteNotification } from '../services/notificationService';
import { useNavigate } from 'react-router-dom';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications({ page: 1, limit: 10 });
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.unreadCount);
    } catch (err) { console.error(err); }
  };

  const handleRead = async (id, link) => {
    await markAsRead(id);
    fetchNotifications();
    if (link) { setOpen(false); navigate(link); }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    await deleteNotification(id);
    fetchNotifications();
  };

  const typeColors = { info: 'bg-blue-500', success: 'bg-green-500', warning: 'bg-yellow-500', error: 'bg-red-500' };

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setOpen(!open)} className="relative p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700">
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-secondary-800 rounded-xl shadow-xl border border-secondary-200 dark:border-secondary-700 z-50 max-h-96 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-secondary-200 dark:border-secondary-700">
            <h3 className="font-semibold">Notifications</h3>
            <button onClick={() => { markAllAsRead(); fetchNotifications(); }} className="text-sm text-primary-600 flex items-center gap-1">
              <CheckCheck size={14} /> Mark all read
            </button>
          </div>
          <div className="overflow-y-auto max-h-80">
            {notifications.length === 0 ? (
              <p className="p-4 text-center text-secondary-500">No notifications</p>
            ) : notifications.map(n => (
              <div key={n._id} onClick={() => handleRead(n._id, n.link)} className={`p-3 border-b border-secondary-100 dark:border-secondary-700 cursor-pointer hover:bg-secondary-50 dark:hover:bg-secondary-700/50 ${!n.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                <div className="flex items-start gap-2">
                  <div className={`w-2 h-2 mt-1.5 rounded-full ${typeColors[n.type] || 'bg-gray-500'}`} />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{n.title}</p>
                    <p className="text-xs text-secondary-500">{n.message}</p>
                    <p className="text-xs text-secondary-400 mt-1">{new Date(n.createdAt).toLocaleTimeString()}</p>
                  </div>
                  <button onClick={(e) => handleDelete(e, n._id)} className="p-1 hover:bg-red-50 rounded"><Trash2 size={14} className="text-red-500" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
