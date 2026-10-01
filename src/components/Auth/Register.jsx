import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import styles from './Auth.module.css';

const IconUser = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

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

const IconCheck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className={styles.alertIcon}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const IconGraduate = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M12 3 1 9l11 6 9-4.91V17h2V9L12 3zm0 12.08L4.39 11 12 6.92 19.61 11 12 15.08zM5 13.18v4l7 3.82 7-3.82v-4L12 17l-7-3.82z"/>
  </svg>
);

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const { fullName, email, password } = form;
    if (!fullName.trim() || !email.trim() || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/api/Auth/Register', {
        email: email.trim(),
        password,
        fullName: fullName.trim(),
      });
      setSuccess(true);
      setTimeout(() => navigate('/login', { state: { registered: true } }), 1800);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.authPage}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.backHomeWrapper}>
            <Link to="/" className={styles.backHomeLink} id="register-back-to-home-btn" title="Return to Home Page">
              <span className={styles.backArrow}>←</span> Back to Home
            </Link>
          </div>
          <div className={styles.logoMark} aria-hidden="true">
            <IconGraduate />
          </div>
          <h1 className={styles.cardTitle}>Create Account</h1>
          <p className={styles.cardSubtitle}>Join EduModern and start learning today</p>
        </div>

        <div className={styles.cardBody}>
          {error && (
            <div className={styles.alertError} role="alert">
              <IconAlert />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className={styles.alertSuccess} role="status">
              <IconCheck />
              <span>Account created! Redirecting you to sign in…</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate id="register-form">
            <div className={styles.formGroup}>
              <label htmlFor="register-name" className={styles.label}>Full Name</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}><IconUser /></span>
                <input
                  id="register-name"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  placeholder="Jane Smith"
                  value={form.fullName}
                  onChange={handleChange}
                  className={`${styles.input} ${error ? styles.inputError : ''}`}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="register-email" className={styles.label}>Email Address</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}><IconMail /></span>
                <input
                  id="register-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="jane@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className={`${styles.input} ${error ? styles.inputError : ''}`}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="register-password" className={styles.label}>Password</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}><IconLock /></span>
                <input
                  id="register-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  className={`${styles.input} ${error ? styles.inputError : ''}`}
                  required
                />
              </div>
            </div>

            <button
              id="register-submit"
              type="submit"
              className={styles.submitBtn}
              disabled={loading || success}
            >
              {loading && <span className={styles.spinner} aria-hidden="true" />}
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>
        </div>

        <div className={styles.cardFooter}>
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
