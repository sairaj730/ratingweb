import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import StoreOwnerDashboardPage from './pages/StoreOwnerDashboardPage';
import ProfilePage from './pages/ProfilePage';
import { getCurrentUser, logout } from './services/authService';
import { jwtDecode } from 'jwt-decode';
import './App.css';

const ROLES = {
  ADMIN: 'System Administrator',
  NORMAL_USER: 'Normal User',
  STORE_OWNER: 'Store Owner'
}

const ProtectedRoute = ({ children, roles }) => {
  const user = getCurrentUser();
  if (!user) {
    return <Navigate to="/login" />;
  }
  const decodedToken = jwtDecode(user.accessToken);
  const userRole = decodedToken.role;

  if (!roles.includes(userRole)) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const user = getCurrentUser();

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  return (
    <Router>
      <div className="App">
        <Sidebar user={user} isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} handleLogout={handleLogout} />
        <main className={`main-content ${isSidebarCollapsed ? 'collapsed' : ''}`}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute roles={[ROLES.NORMAL_USER]}>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute roles={[ROLES.ADMIN]}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/store-owner" 
              element={
                <ProtectedRoute roles={[ROLES.STORE_OWNER]}>
                  <StoreOwnerDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute roles={[ROLES.NORMAL_USER, ROLES.STORE_OWNER, ROLES.ADMIN]}>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
