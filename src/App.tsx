/**
 * Main App component with routing.
 */
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './stores/authStore';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import ReportsPage from './pages/ReportsPage';
import Layout from './components/Layout';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, checkAuth } = useAuthStore();
  
  useEffect(() => {
    checkAuth();
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <BrowserRouter>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--glass-bg)',
            color: 'var(--text-main)',
            border: '1px solid var(--glass-border)',
            backdropFilter: 'blur(12px)',
          },
        }}
      />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected Layout Routes */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/" element={<Navigate to="/chat" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/chat" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
