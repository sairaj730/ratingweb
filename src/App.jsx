
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import StoreOwnerDashboardPage from './pages/StoreOwnerDashboardPage';
import ProfilePage from './pages/ProfilePage';
import { getCurrentUser } from './services/authService';
import { jwtDecode } from 'jwt-decode';

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
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
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
              path="/admin/dashboard" 
              element={
                <ProtectedRoute roles={[ROLES.ADMIN]}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/store/dashboard" 
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
        <Footer />
      </div>
    </Router>
  );
}

export default App;
