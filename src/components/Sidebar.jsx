import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/authService';
import './Sidebar.css';

function Sidebar({ user, isCollapsed, toggleSidebar, handleLogout }) {

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        {isCollapsed ? '>' : '<'}
      </button>
      <h2>RatingApp</h2>
      <ul>
        <li><NavLink to="/" end>Home</NavLink></li>
        {user && (
          <>
            <li><NavLink to="/dashboard">Dashboard</NavLink></li>
            <li><NavLink to="/profile">Profile</NavLink></li>
            {user.role === 'System Administrator' && (
              <li><NavLink to="/admin">Admin Dashboard</NavLink></li>
            )}
            {user.role === 'Store Owner' && (
              <li><NavLink to="/store-owner">Store Dashboard</NavLink></li>
            )}
            <li><a href="#" onClick={handleLogout}>Logout</a></li>
          </>
        )}
        {!user && (
          <>
            <li><NavLink to="/login">Login</NavLink></li>
            <li><NavLink to="/register">Register</NavLink></li>
          </>
        )}
      </ul>
    </div>
  );
}

export default Sidebar;
