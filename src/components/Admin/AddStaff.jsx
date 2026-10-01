import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/api';
import styles from './AddStaff.module.css';

const ROLES = [
  { value: 1, label: 'Administrator', shortLabel: 'Admin' },
  { value: 2, label: 'Teacher',       shortLabel: 'Teacher' },
];

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

const IconShield = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
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

const IconInfo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className={styles.infoBoxIcon}>
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="16" x2="12" y2="12"/>
    <line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);

const BLANK_FORM = { fullName: '', email: '', password: '', role: 2 };

function AddStaff() {
  const { user } = useAuth();

  const [form, setForm]       = useState(BLANK_FORM);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'role' ? Number(value) : value,
    }));
    if (error)   setError('');
    if (success) setSuccess('');
  }

  function handleReset() {
    setForm(BLANK_FORM);
    setError('');
    setSuccess('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { fullName, email, password, role } = form;
    if (!fullName.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/api/Auth/AddStaff', {
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        role,
      });
      const roleLabel = ROLES.find((r) => r.value === role)?.label ?? 'Staff';
      setSuccess(`${roleLabel} "${fullName.trim()}" was added successfully.`);
      setForm(BLANK_FORM);
    } catch (err) {
      setError(err.message || 'Failed to add staff member. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const selectedRole = ROLES.find((r) => r.value === form.role);

  return (
    <div className={styles.adminPage}>
      <div className={styles.pageHeader}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link to="/dashboard">Dashboard</Link>
          <span className={styles.breadcrumbSep} aria-hidden="true">/</span>
          <span>Admin</span>
          <span className={styles.breadcrumbSep} aria-hidden="true">/</span>
          <span>Add Staff</span>
        </nav>

        <h1 className={styles.pageTitle}>
          Add <em>Staff Member</em>
        </h1>
        <p className={styles.pageSubtitle}>
          Create a new administrator or teacher account. Credentials will be sent upon creation.
        </p>
        <hr className={styles.titleRule} />
      </div>

      <div className={styles.card}>
        <div className={styles.cardInner}>
          <p className={styles.sectionLabel}>
            <IconShield aria-hidden="true" style={{ width: 13, height: 13 }} />
            Staff Registration — Performed by {user?.name || 'Admin'}
          </p>

          <div className={styles.infoBox} role="note">
            <IconInfo aria-hidden="true" />
            <span>
              This action is protected. A valid admin JWT is automatically attached
              to this request. Only administrators can access this panel.
            </span>
          </div>

          {error && (
            <div className={styles.alertError} role="alert">
              <IconAlert />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className={styles.alertSuccess} role="status">
              <IconCheck />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate id="add-staff-form">
            <div className={styles.formGrid}>
              <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                <label htmlFor="staff-name" className={styles.label}>Full Name</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}><IconUser /></span>
                  <input
                    id="staff-name"
                    name="fullName"
                    type="text"
                    autoComplete="off"
                    placeholder="e.g. Dr. Sarah Johnson"
                    value={form.fullName}
                    onChange={handleChange}
                    className={`${styles.input} ${error && !form.fullName.trim() ? styles.inputError : ''}`}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="staff-email" className={styles.label}>Email Address</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}><IconMail /></span>
                  <input
                    id="staff-email"
                    name="email"
                    type="email"
                    autoComplete="off"
                    placeholder="staff@school.edu"
                    value={form.email}
                    onChange={handleChange}
                    className={`${styles.input} ${error && !form.email.trim() ? styles.inputError : ''}`}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="staff-password" className={styles.label}>Temporary Password</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}><IconLock /></span>
                  <input
                    id="staff-password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Min. 6 characters"
                    value={form.password}
                    onChange={handleChange}
                    className={`${styles.input} ${error && !form.password ? styles.inputError : ''}`}
                    required
                  />
                </div>
              </div>

              <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                <label htmlFor="staff-role" className={styles.label}>Role</label>
                <div className={styles.selectWrapper}>
                  <select
                    id="staff-role"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    {ROLES.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label} (role = {r.value})
                      </option>
                    ))}
                  </select>
                  <span className={styles.selectArrow} aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </span>
                </div>

                {selectedRole && (
                  <span
                    className={`${styles.roleBadge} ${
                      form.role === 1 ? styles.roleBadgeAdmin : styles.roleBadgeTeacher
                    }`}
                    aria-live="polite"
                  >
                    {form.role === 1 ? '🔑' : '📚'} {selectedRole.shortLabel}
                  </span>
                )}
              </div>
            </div>

            <div className={styles.submitRow}>
              <button
                id="add-staff-reset"
                type="button"
                className={styles.resetBtn}
                onClick={handleReset}
                disabled={loading}
              >
                Clear
              </button>
              <button
                id="add-staff-submit"
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading && <span className={styles.spinner} aria-hidden="true" />}
                {loading ? 'Adding Staff…' : 'Add Staff Member'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddStaff;
