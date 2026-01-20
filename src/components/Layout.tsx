import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-[var(--bg-app)]">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 relative z-10">
        <Outlet />
      </main>
    </div>
  );
}
