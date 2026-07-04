import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, mobileNumber, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="brand">
          <span className="brand-mark">D</span>
          DocVault
        </div>
        <nav className="nav-links">
          {isAuthenticated && (
            <>
              <NavLink to="/upload" className={({ isActive }) => (isActive ? 'active' : '')}>
                Upload
              </NavLink>
              <NavLink to="/search" className={({ isActive }) => (isActive ? 'active' : '')}>
                Search
              </NavLink>
              <NavLink to="/admin" className={({ isActive }) => (isActive ? 'active' : '')}>
                Admin
              </NavLink>
            </>
          )}
          {isAuthenticated ? (
            <>
              <span style={{ color: '#8a99ac', fontSize: '0.85rem', margin: '0 6px' }}>
                {mobileNumber}
              </span>
              <button className="linklike" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <NavLink to="/login" className={({ isActive }) => (isActive ? 'active' : '')}>
              Login
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}
