import React from 'react';
import { NavLink } from 'react-router-dom';
import { MessageSquare, BarChart2, LogOut, User } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

export function Sidebar() {
  const { user, logout } = useAuthStore();

  return (
    <aside className="w-64 glass-panel border-r-0 rounded-l-none h-screen flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6 border-b border-[var(--glass-border)]">
        <h1 className="text-xl font-bold text-gradient">Chat Analytics</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <NavLink
          to="/chat"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive
                ? 'bg-[var(--primary)] text-white shadow-[0_0_15px_var(--primary-glow)]'
                : 'text-[var(--text-muted)] hover:bg-[var(--glass-highlight)] hover:text-white'
            }`
          }
        >
          <MessageSquare size={20} />
          <span>Chat Assistant</span>
        </NavLink>

        <NavLink
          to="/reports"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive
                ? 'bg-[var(--primary)] text-white shadow-[0_0_15px_var(--primary-glow)]'
                : 'text-[var(--text-muted)] hover:bg-[var(--glass-highlight)] hover:text-white'
            }`
          }
        >
          <BarChart2 size={20} />
          <span>Reports</span>
        </NavLink>
      </nav>

      <div className="p-4 border-t border-[var(--glass-border)]">
        <div className="flex items-center gap-3 px-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate text-white">{user?.full_name}</p>
            <p className="text-xs text-[var(--text-muted)] truncate capitalize">{user?.role}</p>
          </div>
        </div>
        
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 p-2 rounded-lg text-sm text-[var(--text-muted)] hover:text-[var(--error)] hover:bg-[rgba(239,68,68,0.1)] transition-colors"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
