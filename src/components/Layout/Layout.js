import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Layout.css';

const Layout = ({ children, title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'warden') return '/warden/dashboard';
    if (user.role === 'student') return '/student/dashboard';
    return '/';
  };

  const getNavLinks = () => {
    if (user.role === 'admin') {
      return [
        { to: '/admin/dashboard', label: 'Dashboard' },
        { to: '/admin/students', label: 'Students' },
        { to: '/admin/wardens', label: 'Wardens' },
        { to: '/admin/attendance', label: 'Attendance' },
        { to: '/admin/leave-applications', label: 'Leave Applications' },
        { to: '/admin/reminders', label: 'Reminders' },
      ];
    } else if (user.role === 'warden') {
      return [
        { to: '/warden/dashboard', label: 'Dashboard' },
        { to: '/warden/students', label: 'Students' },
        { to: '/warden/attendance', label: 'Attendance' },
        { to: '/warden/college-leave', label: 'College Leave' },
        { to: '/warden/leave-applications', label: 'Leave Applications' },
        { to: '/warden/reminders', label: 'Reminders' },
      ];
    } else if (user.role === 'student') {
      return [
        { to: '/student/dashboard', label: 'Dashboard' },
        { to: '/student/profile', label: 'My Profile' },
        { to: '/student/attendance', label: 'My Attendance' },
        { to: '/student/college-leave', label: 'College Leave' },
        { to: '/student/leave-applications', label: 'Leave Applications' },
      ];
    }
    return [];
  };

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="navbar-container">
          <Link to={getDashboardLink()} className="navbar-brand">
            Hostel Management
          </Link>

          <div className="navbar-links">
            {getNavLinks().map((link) => (
              <Link key={link.to} to={link.to} className="navbar-link">
                {link.label}
              </Link>
            ))}
          </div>

          <div className="navbar-user">
            <span className="user-info">
              {user.username} ({user.role})
            </span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <div className="content-container">
          {title && <h1 className="page-title">{title}</h1>}
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
