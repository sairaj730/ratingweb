
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/authService';
import './Header.css';
import { jwtDecode } from 'jwt-decode';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      const decodedToken = jwtDecode(user.accessToken);
      setUser(decodedToken);
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/');
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">RatingWeb</Link>
      </div>
      <nav className={isMenuOpen ? 'mobile-menu' : ''}>
        <ul>
          <li><Link to="/">Home</Link></li>
          {user ? (
            <>
              <li><span>Welcome, {user.name}</span></li>
              <li><Link to="/profile">Profile</Link></li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          )}
        </ul>
      </nav>
      <div className="menu-icon" onClick={toggleMenu}>
        <div className={isMenuOpen ? 'bar1 open' : 'bar1'}></div>
        <div className={isMenuOpen ? 'bar2 open' : 'bar2'}></div>
        <div className={isMenuOpen ? 'bar3 open' : 'bar3'}></div>
      </div>
    </header>
  );
}

export default Header;
