import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth, decodeToken } from '../context/AuthContext';

const LogOutIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const BookOpenIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const UserIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const storedToken =
    localStorage.getItem('edu_token') || localStorage.getItem('token') || '';
  const token = auth?.token || storedToken;
  const user = auth?.user || (storedToken ? decodeToken(storedToken) : null);

  const storedRole = (localStorage.getItem('userRole') || '').toLowerCase();

  const isLoggedIn = Boolean(token);

  const rawName = user?.name || user?.fullName || user?.email || (isLoggedIn ? 'Student' : 'User');
  const firstName =
    rawName.split(' ')[0] && rawName.split(' ')[0] !== 'undefined'
      ? rawName.split(' ')[0]
      : 'Student';
  const initials = (firstName.slice(0, 2) || 'ME').toUpperCase();

  const userRole = (user?.role || storedRole || '').toString().toLowerCase();
  const isStudent = userRole === 'student' || (!userRole && isLoggedIn);
  const isAdmin = userRole === 'admin';
  const isInstructor = userRole === 'instructor' || userRole === 'teacher';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('edu_token');
    localStorage.removeItem('userRole');
    if (auth?.logout) auth.logout();
    navigate('/login', { replace: true });
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="edu-nav-header">
      <style>{`
        .edu-nav-header {
          background-color: #0f172a;
          border-bottom: 1px solid #1e293b;
          position: sticky;
          top: 0;
          z-index: 1000;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }

        .edu-nav-container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 1.5rem;
          height: 68px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
        }

        .edu-nav-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          flex-shrink: 0;
        }

        .edu-logo-badge {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0f172a;
          font-family: 'Playfair Display', Georgia, serif;
          font-weight: 700;
          font-size: 1.25rem;
          box-shadow: 0 2px 8px rgba(217, 119, 6, 0.3);
        }

        .edu-logo-text {
          font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
          font-size: 1.35rem;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.01em;
        }

        .edu-logo-accent {
          color: #f59e0b;
        }

        .edu-nav-menu {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .edu-nav-link {
          color: #94a3b8;
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.4rem 0.6rem;
          border-radius: 6px;
        }

        .edu-nav-link:hover {
          color: #f8fafc;
          background: rgba(255, 255, 255, 0.05);
        }

        .edu-nav-link.active {
          color: #f59e0b;
          font-weight: 600;
          background: rgba(245, 158, 11, 0.1);
        }

        .edu-nav-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .edu-nav-profile-link {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          text-decoration: none;
          padding: 0.35rem 0.75rem 0.35rem 0.35rem;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.2s ease;
        }

        .edu-nav-profile-link:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: #f59e0b;
          transform: translateY(-1px);
        }

        .edu-nav-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #f59e0b;
          color: #0f172a;
          font-weight: 700;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          justify-content: center;
          letter-spacing: -0.02em;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .edu-nav-username {
          color: #f8fafc;
          font-size: 0.85rem;
          font-weight: 600;
          white-space: nowrap;
        }

        .edu-role-tag {
          font-size: 0.68rem;
          font-weight: 600;
          color: #f59e0b;
          background: rgba(245, 158, 11, 0.15);
          padding: 0.15rem 0.45rem;
          border-radius: 9999px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .edu-btn-logout {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: transparent;
          border: 1px solid #334155;
          color: #cbd5e1;
          font-size: 0.825rem;
          font-weight: 500;
          padding: 0.45rem 0.85rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .edu-btn-logout:hover {
          color: #f87171;
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }

        .edu-btn-login {
          color: #e2e8f0;
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          border: 1px solid #334155;
          transition: all 0.2s;
        }

        .edu-btn-login:hover {
          color: #ffffff;
          border-color: #f59e0b;
        }

        .edu-btn-register {
          background: #f59e0b;
          color: #0f172a;
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 600;
          padding: 0.55rem 1.15rem;
          border-radius: 8px;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(245, 158, 11, 0.25);
        }

        .edu-btn-register:hover {
          background: #fbbf24;
          transform: translateY(-1px);
        }

        .edu-nav-toggle {
          display: none;
          background: transparent;
          border: none;
          color: #cbd5e1;
          cursor: pointer;
          padding: 0.5rem;
        }

        @media (max-width: 860px) {
          .edu-nav-menu {
            display: none;
          }

          .edu-nav-toggle {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .edu-mobile-drawer {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            padding: 1.25rem 1.5rem;
            background: #0f172a;
            border-top: 1px solid #1e293b;
          }
        }
      `}</style>

      <div className="edu-nav-container">
        <Link to="/home" className="edu-nav-logo" aria-label="EduModern Home">
          <span className="edu-logo-text">
            Edu<span className="edu-logo-accent">Modern</span>
          </span>
        </Link>

        <nav className="edu-nav-menu" aria-label="Main Navigation">
          {!isLoggedIn && (
            <Link to="/home" className={`edu-nav-link ${isActive('/home') ? 'active' : ''}`}>
              Home
            </Link>
          )}

          <Link
            to="/courses"
            id="nav-course-catalog"
            className={`edu-nav-link ${isActive('/courses') ? 'active' : ''}`}
          >
            Course Catalog
          </Link>

          {isLoggedIn && isStudent && (
            <Link
              to="/my-courses"
              className={`edu-nav-link ${isActive('/my-courses') ? 'active' : ''}`}
            >
              <BookOpenIcon />
              <span>My Courses</span>
            </Link>
          )}

          {isLoggedIn && isInstructor && (
            <Link
              to="/dashboard"
              className={`edu-nav-link ${isActive('/dashboard') ? 'active' : ''}`}
            >
              Dashboard
            </Link>
          )}

          {isLoggedIn && isAdmin && (
            <Link
              to="/admin-control"
              className={`edu-nav-link ${isActive('/admin-control') ? 'active' : ''}`}
            >
              <ShieldIcon />
              <span>Admin Control</span>
            </Link>
          )}
        </nav>

        <div className="edu-nav-right">
          {isLoggedIn ? (
            <>
              <Link
                to="/profile"
                className="edu-nav-profile-link"
                title="View Profile"
                style={{ cursor: 'pointer', textDecoration: 'none' }}
              >
                <div className="edu-nav-avatar" aria-hidden="true">
                  {initials}
                </div>
                <span className="edu-nav-username">{firstName}</span>
                {user?.role && (
                  <span className="edu-role-tag hidden sm:inline-block">
                    {user.role}
                  </span>
                )}
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="edu-btn-logout"
                title="Log out of your account"
              >
                <LogOutIcon />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="edu-btn-login">
                Log In
              </Link>
              <Link to="/register" className="edu-btn-register">
                Get Started
              </Link>
            </>
          )}

          <button
            type="button"
            className="edu-nav-toggle"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="edu-mobile-drawer">
          {!isLoggedIn && (
            <Link
              to="/home"
              className="edu-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
          )}
          <Link
            to="/courses"
            id="mobile-nav-course-catalog"
            className="edu-nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            Course Catalog
          </Link>

          {isLoggedIn && isStudent && (
            <Link
              to="/my-courses"
              className="edu-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              My Courses
            </Link>
          )}

          {isLoggedIn && isInstructor && (
            <Link
              to="/dashboard"
              className="edu-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Instructor Dashboard
            </Link>
          )}

          {isLoggedIn && isAdmin && (
            <Link
              to="/admin-control"
              className="edu-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Admin Control Center
            </Link>
          )}

          {isLoggedIn && (
            <Link
              to="/profile"
              className="edu-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              My Profile
            </Link>
          )}

          {isLoggedIn && (
            <button
              type="button"
              onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'transparent',
                border: '1px solid #334155',
                color: '#f87171',
                fontSize: '0.875rem',
                fontWeight: 500,
                padding: '0.5rem 0.85rem',
                borderRadius: '8px',
                cursor: 'pointer',
                marginTop: '0.25rem',
                width: 'fit-content',
              }}
            >
              <LogOutIcon />
              <span>Log Out</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
}
