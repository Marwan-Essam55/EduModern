import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth, decodeToken } from '../../context/AuthContext';
import api from '../../api/api';
import styles from './Auth.module.css';

const IconMail = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const IconLock = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const IconAlert = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className={styles.alertIcon}>
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const IconGraduate = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M12 3 1 9l11 6 9-4.91V17h2V9L12 3zm0 12.08L4.39 11 12 6.92 19.61 11 12 15.08zM5 13.18v4l7 3.82 7-3.82v-4L12 17l-7-3.82z"/>
  </svg>
);

function b64url(obj) {
  return btoa(JSON.stringify(obj))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function buildDemoToken(role = 'Student', name = 'Demo User', email = 'demo@edumodern.com') {
  const exp = Math.floor(Date.now() / 1000) + 86400;
  const header  = b64url({ alg: 'HS256', typ: 'JWT' });
  const payload = b64url({
    sub:   `demo-${role.toLowerCase()}-1`,
    id:    role === 'Admin' ? 'admin-1' : role === 'Instructor' ? 'inst-1' : 'std-1',
    name:  name || `Demo ${role}`,
    email: email,
    role:  role,
    exp,
  });
  const sig = b64url({ demo: true });
  return `${header}.${payload}.${sig}`;
}

const DEMO_ACCOUNTS = [
  {
    role: 'Student',
    label: 'Demo as Student',
    emoji: '🎓',
    email: 'student@edumodern.com',
    password: 'Student123!',
    targetRoute: '/courses',
    name: 'Demo Student',
  },
  {
    role: 'Instructor',
    label: 'Demo as Instructor',
    emoji: '👨‍🏫',
    email: 'instructor@edumodern.com',
    password: 'Instructor123!',
    targetRoute: '/dashboard',
    name: 'Demo Instructor',
  },
  {
    role: 'Admin',
    label: 'Demo as Admin',
    emoji: '🛡️',
    email: 'admin@edumodern.com',
    password: 'Admin123!',
    targetRoute: '/admin',
    name: 'Demo Admin',
  },
];

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeDemoRole, setActiveDemoRole] = useState(null);

  const intendedPath = location.state?.from?.pathname || '/courses';

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!form.email.trim() || !form.password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/api/Auth/Login', {
        email: form.email.trim(),
        password: form.password,
      });

      const token = data?.token ?? data?.Token ?? data;
      if (!token || typeof token !== 'string') {
        throw new Error('Invalid response from server. Please try again.');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('edu_token', token);

      const decodedUser = login(token) || decodeToken(token);
      const userRole = (decodedUser?.role || 'Student').toString();
      localStorage.setItem('userRole', userRole);

      console.log('[Login] User authenticated successfully:', {
        id: decodedUser?.id,
        role: decodedUser?.role,
        name: decodedUser?.name,
      });

      const r = userRole.toLowerCase();
      if (r === 'admin') {
        navigate('/admin', { replace: true });
      } else if (r === 'instructor' || r === 'teacher') {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/courses', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  }

  async function handleQuickDemoLogin(demo) {
    setError('');
    setActiveDemoRole(demo.role);

    setForm({ email: demo.email, password: demo.password });

    try {
      let token = null;

      try {
        const { data } = await api.post('/api/Auth/Login', {
          email: demo.email,
          password: demo.password,
        });
        token = data?.token ?? data?.Token ?? data;
      } catch (apiErr) {
        console.warn(`[Login] Backend offline or credentials not found for ${demo.role}. Using local demo token:`, apiErr?.message);
      }

      if (!token || typeof token !== 'string') {
        token = buildDemoToken(demo.role, demo.name, demo.email);
      }

      localStorage.setItem('token', token);
      localStorage.setItem('edu_token', token);
      localStorage.setItem('userRole', demo.role);

      login(token);

      navigate(demo.targetRoute, { replace: true });
    } catch (err) {
      console.error('[Login] Demo login exception:', err);
      setError(`Demo login failed for ${demo.role}.`);
    } finally {
      setActiveDemoRole(null);
    }
  }

  return (
    <div className={styles.authPage}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.backHomeWrapper}>
            <Link to="/" className={styles.backHomeLink} id="login-back-to-home-btn" title="Return to Home Page">
              <span className={styles.backArrow}>←</span> Back to Home
            </Link>
          </div>
          <div className={styles.logoMark} aria-hidden="true">
            <IconGraduate />
          </div>
          <h1 className={styles.cardTitle}>Welcome Back</h1>
          <p className={styles.cardSubtitle}>Sign in to your EduModern account</p>
        </div>

        <div className={styles.cardBody}>
          {error && (
            <div className={styles.alertError} role="alert">
              <IconAlert />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate id="login-form">
            <div className={styles.formGroup}>
              <label htmlFor="login-email" className={styles.label}>Email Address</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}><IconMail /></span>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className={`${styles.input} ${error ? styles.inputError : ''}`}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="login-password" className={styles.label}>Password</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}><IconLock /></span>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className={`${styles.input} ${error ? styles.inputError : ''}`}
                  required
                />
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              className={styles.submitBtn}
              disabled={loading || Boolean(activeDemoRole)}
            >
              {loading && <span className={styles.spinner} aria-hidden="true" />}
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className={styles.divider}>or quick demo access</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {DEMO_ACCOUNTS.map((demo) => {
              const isThisLoading = activeDemoRole === demo.role;
              const isAnyBusy = loading || Boolean(activeDemoRole);

              return (
                <button
                  key={demo.role}
                  id={`demo-${demo.role.toLowerCase()}-btn`}
                  type="button"
                  onClick={() => handleQuickDemoLogin(demo)}
                  disabled={isAnyBusy}
                  style={{
                    width: '100%',
                    padding: '.72rem 1.25rem',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '.9rem',
                    fontWeight: 600,
                    letterSpacing: '.02em',
                    color: '#c9aa5a',
                    background: 'transparent',
                    border: '1.5px solid #c9aa5a',
                    borderRadius: '4px',
                    cursor: isAnyBusy ? 'not-allowed' : 'pointer',
                    opacity: isAnyBusy && !isThisLoading ? 0.6 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '.6rem',
                    transition: 'all 0.18s ease',
                    boxShadow: '0 1px 3px rgba(18, 32, 64, 0.04)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isAnyBusy) {
                      e.currentTarget.style.background = 'rgba(201, 170, 90, 0.08)';
                      e.currentTarget.style.borderColor = '#d4b96a';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = '#c9aa5a';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {isThisLoading ? (
                    <>
                      <span
                        className={styles.spinner}
                        style={{
                          border: '2px solid rgba(201, 170, 90, 0.25)',
                          borderTopColor: '#c9aa5a',
                          width: '14px',
                          height: '14px',
                          marginRight: '.35rem',
                        }}
                        aria-hidden="true"
                      />
                      <span>Entering as {demo.role}…</span>
                    </>
                  ) : (
                    <>
                      <span style={{ fontSize: '1.1rem', lineHeight: 1 }} aria-hidden="true">
                        {demo.emoji}
                      </span>
                      <span>{demo.label}</span>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className={styles.cardFooter}>
          Don&apos;t have an account?{' '}
          <Link to="/register">Create one</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
