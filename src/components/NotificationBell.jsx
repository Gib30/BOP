import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { useNotifications } from '../hooks/useNotifications';

export default function NotificationBell() {
  const { account } = useWallet();
  const { notifications, unreadCount, markAsRead, markAllRead } = useNotifications(account);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!account) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-neutral-400 hover:text-amber-400 transition-colors rounded-lg"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-500 text-black text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto bg-neutral-900 border border-neutral-800 rounded-xl shadow-xl z-50">
          <div className="p-3 border-b border-neutral-800 flex items-center justify-between">
            <span className="font-semibold text-white">Notifications</span>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-xs text-amber-400 hover:text-amber-300">
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-neutral-500 text-sm text-center">No notifications yet</div>
            ) : (
              notifications.map((n) => (
                <Link
                  key={n.id}
                  to={n.link || '#'}
                  onClick={() => {
                    markAsRead(n.id);
                    setOpen(false);
                  }}
                  className={`block p-4 border-b border-neutral-800/50 hover:bg-neutral-800/50 transition-colors ${!n.read ? 'bg-amber-900/10' : ''}`}
                >
                  <p className="text-sm text-white">{n.message}</p>
                  <span className="text-xs text-neutral-500">{new Date(n.created_at).toLocaleDateString()}</span>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
