import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { AddWaste } from './pages/AddWaste';
import { WasteList } from './pages/WasteList';
import { Rewards } from './pages/Rewards';
import { AdminDashboard } from './pages/AdminDashboard';
import './styles/global.css';

function AppLayout({ children }) {
  return (
    <div className="layout-wrapper">
      <div className="layout-header">
        <Header />
      </div>
      <div className="layout-body">
        <div className="layout-sidebar">
          <Sidebar />
        </div>
        <div className="layout-main">{children}</div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-waste"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <AddWaste />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/waste-list"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <WasteList />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/rewards"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Rewards />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <AdminDashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export {AppLayout , App}