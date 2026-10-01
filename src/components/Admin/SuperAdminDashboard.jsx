import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api';

const INITIAL_INSTRUCTORS = [
  {
    id: 'inst-1',
    fullName: 'Dr. Eleanor Vance',
    email: 'e.vance@edumodern.edu',
    department: 'Computer Science',
    coursesCount: 4,
    status: 'Active',
    joinedDate: '2025-08-12',
  },
  {
    id: 'inst-2',
    fullName: 'Prof. Marcus Chen',
    email: 'm.chen@edumodern.edu',
    department: 'Data Engineering',
    coursesCount: 6,
    status: 'Active',
    joinedDate: '2025-09-01',
  },
  {
    id: 'inst-3',
    fullName: 'Dr. Sarah Al-Mansoor',
    email: 's.almansoor@edumodern.edu',
    department: 'Artificial Intelligence',
    coursesCount: 3,
    status: 'Active',
    joinedDate: '2025-10-15',
  },
  {
    id: 'inst-4',
    fullName: 'Prof. Julian Thorne',
    email: 'j.thorne@edumodern.edu',
    department: 'Software Architecture',
    coursesCount: 5,
    status: 'Active',
    joinedDate: '2025-11-20',
  },
];

const INITIAL_STUDENTS = [
  {
    id: 'std-1',
    fullName: 'Alex Morgan',
    email: 'a.morgan@student.edumodern.edu',
    department: 'Computer Science',
    enrolledCount: 4,
    status: 'Active',
    joinedDate: '2025-09-10',
  },
  {
    id: 'std-2',
    fullName: 'Layla Hassan',
    email: 'l.hassan@student.edumodern.edu',
    department: 'Data Engineering',
    enrolledCount: 3,
    status: 'Active',
    joinedDate: '2025-09-12',
  },
  {
    id: 'std-3',
    fullName: 'David Kim',
    email: 'd.kim@student.edumodern.edu',
    department: 'Artificial Intelligence',
    enrolledCount: 5,
    status: 'Active',
    joinedDate: '2025-10-02',
  },
  {
    id: 'std-4',
    fullName: 'Sophia Bennett',
    email: 's.bennett@student.edumodern.edu',
    department: 'Cybersecurity',
    enrolledCount: 2,
    status: 'Active',
    joinedDate: '2025-11-05',
  },
];

const ShieldIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const UserIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const MailIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LockIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const EyeIcon = ({ visible }) => (
  visible ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
);

const UserPlusIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <line x1="20" y1="8" x2="20" y2="14" />
    <line x1="23" y1="11" x2="17" y2="11" />
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const RefreshIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const AcademicCapIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

const UsersIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

export default function SuperAdminDashboard() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [activeListTab, setActiveListTab] = useState('instructors');

  const [instructors, setInstructors] = useState(INITIAL_INSTRUCTORS);
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUsingMock, setIsUsingMock] = useState(false);

  const fetchInstructors = async () => {
    setIsLoadingList(true);
    try {
      const token = localStorage.getItem('edu_token');
      const response = await api.get('/api/Admin/Instructors', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (response.data && Array.isArray(response.data)) {
        setInstructors(response.data);
        setIsUsingMock(false);
      } else {
        setInstructors(INITIAL_INSTRUCTORS);
        setIsUsingMock(true);
      }
    } catch (err) {
      console.info('Instructors API not ready or error; displaying mock data.', err.message);
      setInstructors(INITIAL_INSTRUCTORS);
      setIsUsingMock(true);
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.password.trim()) {
      setFeedback({
        type: 'error',
        message: 'Please complete all required fields.',
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    const payload = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      password: formData.password,
      role: 'Teacher',
    };

    console.log('[SuperAdminDashboard] Prepared POST request to /api/Auth/RegisterInstructor:', payload);

    try {
      const newInstructor = {
        id: `inst-${Date.now()}`,
        fullName: payload.fullName,
        email: payload.email,
        department: 'General Instruction',
        coursesCount: 0,
        status: 'Active',
        joinedDate: new Date().toISOString().split('T')[0],
      };

      setInstructors((prev) => [newInstructor, ...prev]);

      setFeedback({
        type: 'success',
        message: `Instructor "${payload.fullName}" registered successfully! (POST /api/Auth/RegisterInstructor payload ready in console)`,
      });

      setFormData({
        fullName: '',
        email: '',
        password: '',
      });

      setActiveListTab('instructors');
    } catch (err) {
      console.error('Registration failed:', err);
      setFeedback({
        type: 'error',
        message: err.message || 'Failed to register instructor. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = (userId, role) => {
    const userRoleText = role === 'Student' ? 'student' : 'instructor';
    const confirmed = window.confirm(`Are you sure you want to delete this ${userRoleText}?`);

    if (confirmed) {
      console.log(`[SuperAdminDashboard] Prepared DELETE request to /api/Admin/DeleteUser/${userId} (Role: ${role})`);

      if (role === 'Student' || activeListTab === 'students') {
        setStudents((prev) => prev.filter((user) => user.id !== userId));
      } else {
        setInstructors((prev) => prev.filter((user) => user.id !== userId));
      }

      setFeedback({
        type: 'success',
        message: `User (${userId}) deleted successfully. (DELETE /api/Admin/DeleteUser/${userId} prepared)`,
      });
    }
  };

  const currentList = activeListTab === 'instructors' ? instructors : students;

  const filteredUsers = currentList.filter((user) => {
    const name = user.fullName || user.name || '';
    const email = user.email || '';
    const q = searchQuery.toLowerCase();
    return name.toLowerCase().includes(q) || email.toLowerCase().includes(q);
  });

  return (
    <div className="edu-admin-container">
      <style>{`
        .edu-admin-container {
          min-height: 100vh;
          background-color: #fdfbf7;
          color: #0f172a;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          padding: 2.5rem 1.5rem;
          box-sizing: border-box;
          background-image: 
            radial-gradient(#e5e0d4 0.75px, transparent 0.75px),
            radial-gradient(#e5e0d4 0.75px, #fdfbf7 0.75px);
          background-size: 30px 30px;
          background-position: 0 0, 15px 15px;
        }

        .edu-admin-wrapper {
          max-width: 1240px;
          margin: 0 auto;
        }

        .edu-header {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #e9e4d9;
        }

        .edu-header-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .edu-badge-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #b45309;
          background: #fef3c7;
          padding: 0.35rem 0.75rem;
          border-radius: 9999px;
          border: 1px solid #fde68a;
          width: fit-content;
        }

        .edu-nav-links {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .edu-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #ffffff;
          border: 1px solid #dcd7cc;
          color: #1e293b;
          font-size: 0.875rem;
          font-weight: 500;
          padding: 0.55rem 1.1rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
        }

        .edu-btn-secondary:hover {
          background: #f8f6f0;
          border-color: #c9c3b5;
          transform: translateY(-1px);
        }

        .edu-title {
          font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
          font-size: 2.25rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }

        .edu-subtitle {
          font-size: 1rem;
          color: #64748b;
          margin: 0;
          font-weight: 400;
        }

        .edu-feedback {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
          border-radius: 10px;
          margin-bottom: 2rem;
          font-size: 0.9rem;
          line-height: 1.4;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
          animation: slideDown 0.3s ease;
        }

        .edu-feedback-success {
          background-color: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #166534;
        }

        .edu-feedback-error {
          background-color: #fef2f2;
          border: 1px solid #fecaca;
          color: #991b1b;
        }

        .edu-grid-layout {
          display: grid;
          grid-template-columns: 380px 1fr;
          gap: 2rem;
          align-items: start;
        }

        @media (max-width: 980px) {
          .edu-grid-layout {
            grid-template-columns: 1fr;
          }
        }

        .edu-card {
          background: #ffffff;
          border-radius: 14px;
          border: 1px solid #e8e4dc;
          box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 1px 3px rgba(15, 23, 42, 0.03);
          overflow: hidden;
          transition: border-color 0.2s ease;
        }

        .edu-card-gold-accent {
          border-top: 4px solid #c9aa5a;
        }

        .edu-card-header {
          padding: 1.5rem 1.75rem 1.25rem;
          border-bottom: 1px solid #f1ece4;
        }

        .edu-card-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.35rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 0.4rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .edu-card-subtitle {
          font-size: 0.85rem;
          color: #64748b;
          margin: 0;
          line-height: 1.45;
        }

        .edu-form {
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .edu-field-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .edu-label {
          font-size: 0.825rem;
          font-weight: 600;
          color: #1e293b;
          letter-spacing: 0.01em;
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .edu-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .edu-input-icon {
          position: absolute;
          left: 0.85rem;
          color: #94a3b8;
          display: flex;
          align-items: center;
          pointer-events: none;
        }

        .edu-input {
          width: 100%;
          padding: 0.7rem 0.85rem 0.7rem 2.4rem;
          font-size: 0.9rem;
          color: #0f172a;
          background: #faf9f6;
          border: 1px solid #dcd7cc;
          border-radius: 8px;
          outline: none;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .edu-input:focus {
          background: #ffffff;
          border-color: #c9aa5a;
          box-shadow: 0 0 0 3px rgba(201, 170, 90, 0.2);
        }

        .edu-password-toggle {
          position: absolute;
          right: 0.75rem;
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 0.25rem;
          display: flex;
          align-items: center;
          transition: color 0.15s;
        }

        .edu-password-toggle:hover {
          color: #475569;
        }

        .edu-btn-submit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          background: #0f172a;
          color: #f8fafc;
          border: 1px solid #0f172a;
          font-size: 0.95rem;
          font-weight: 600;
          padding: 0.85rem 1.25rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 0.5rem;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.12);
        }

        .edu-btn-submit:hover:not(:disabled) {
          background: #1e293b;
          border-color: #c9aa5a;
          box-shadow: 0 6px 16px rgba(15, 23, 42, 0.18);
          transform: translateY(-1px);
        }

        .edu-btn-submit:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .edu-tabs-bar {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.85rem 1.75rem;
          background: #fbf9f5;
          border-bottom: 1px solid #ede8de;
        }

        .edu-tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.5rem 1rem;
          font-size: 0.85rem;
          font-weight: 600;
          border-radius: 8px;
          border: 1px solid transparent;
          background: transparent;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .edu-tab-btn:hover {
          color: #0f172a;
          background: #f1ece4;
        }

        .edu-tab-btn.active {
          background: #0f172a;
          color: #f8fafc;
          border-color: #0f172a;
          box-shadow: 0 2px 6px rgba(15, 23, 42, 0.15);
        }

        .edu-tab-pill {
          font-size: 0.72rem;
          padding: 0.15rem 0.45rem;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.2);
          color: inherit;
        }

        .edu-tab-btn:not(.active) .edu-tab-pill {
          background: #e2e8f0;
          color: #475569;
        }

        .edu-list-header {
          padding: 1.25rem 1.75rem;
          border-bottom: 1px solid #f1ece4;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .edu-list-title-group {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .edu-list-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .edu-search-box {
          position: relative;
          display: flex;
          align-items: center;
        }

        .edu-search-input {
          padding: 0.5rem 0.85rem 0.5rem 2.2rem;
          font-size: 0.85rem;
          background: #faf9f6;
          border: 1px solid #dcd7cc;
          border-radius: 7px;
          color: #0f172a;
          outline: none;
          width: 220px;
          transition: all 0.2s;
        }

        .edu-search-input:focus {
          background: #ffffff;
          border-color: #c9aa5a;
          width: 250px;
          box-shadow: 0 0 0 3px rgba(201, 170, 90, 0.15);
        }

        .edu-btn-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: #faf9f6;
          border: 1px solid #dcd7cc;
          border-radius: 7px;
          color: #475569;
          cursor: pointer;
          transition: all 0.18s;
        }

        .edu-btn-icon:hover {
          background: #ffffff;
          color: #0f172a;
          border-color: #c9aa5a;
        }

        .edu-table-container {
          overflow-x: auto;
        }

        .edu-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.875rem;
        }

        .edu-table th {
          background: #f8f6f0;
          color: #475569;
          font-weight: 600;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 0.9rem 1.25rem;
          border-bottom: 1px solid #e8e4dc;
          white-space: nowrap;
        }

        .edu-table td {
          padding: 1rem 1.25rem;
          border-bottom: 1px solid #f1ece4;
          color: #334155;
          vertical-align: middle;
        }

        .edu-table tr:last-child td {
          border-bottom: none;
        }

        .edu-table tr:hover td {
          background-color: #faf8f3;
        }

        .edu-user-cell {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .edu-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #0f172a;
          color: #c9aa5a;
          font-weight: 700;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          justify-content: center;
          letter-spacing: -0.02em;
          box-shadow: 0 2px 4px rgba(15, 23, 42, 0.1);
        }

        .edu-avatar-student {
          background: #1e3a8a;
          color: #93c5fd;
        }

        .edu-user-name {
          font-weight: 600;
          color: #0f172a;
          display: block;
        }

        .edu-user-id {
          font-size: 0.75rem;
          color: #94a3b8;
        }

        .edu-role-badge {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 600;
          color: #1e3a8a;
          background: #dbeafe;
          padding: 0.2rem 0.6rem;
          border-radius: 9999px;
          border: 1px solid #bfdbfe;
        }

        .edu-role-badge-student {
          color: #065f46;
          background: #d1fae5;
          border-color: #a7f3d0;
        }

        .edu-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: #166534;
          background: #dcfce7;
          padding: 0.2rem 0.6rem;
          border-radius: 9999px;
          border: 1px solid #bbf7d0;
        }

        .edu-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #16a34a;
        }

        .edu-btn-delete {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.45rem 0.75rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: #dc2626;
          background: #fef2f2;
          border: 1px solid #fee2e2;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .edu-btn-delete:hover {
          color: #ffffff;
          background: #dc2626;
          border-color: #dc2626;
          box-shadow: 0 2px 6px rgba(220, 38, 38, 0.25);
          transform: translateY(-1px);
        }

        .edu-mock-notice {
          padding: 0.65rem 1.25rem;
          background: #fffbeb;
          border-bottom: 1px solid #fef3c7;
          color: #92400e;
          font-size: 0.78rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .edu-empty-state {
          padding: 3.5rem 1.5rem;
          text-align: center;
          color: #64748b;
        }

        .edu-empty-icon {
          width: 48px;
          height: 48px;
          margin: 0 auto 1rem;
          color: #cbd5e1;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="edu-admin-wrapper">
        <header className="edu-header">
          <div className="edu-header-top">
            <span className="edu-badge-tag">
              <ShieldIcon /> Master Control
            </span>
            <div className="edu-nav-links">
              <Link to="/dashboard" className="edu-btn-secondary">
                ← Dashboard
              </Link>
              <Link to="/admin/add-staff" className="edu-btn-secondary">
                Manage Staff
              </Link>
            </div>
          </div>
          <div>
            <h1 className="edu-title">Admin Control Center</h1>
            <p className="edu-subtitle">Manage platform instructors and system users</p>
          </div>
        </header>

        {feedback && (
          <div className={`edu-feedback edu-feedback-${feedback.type}`} role="alert">
            {feedback.type === 'success' ? <CheckCircleIcon /> : <ShieldIcon />}
            <span>{feedback.message}</span>
          </div>
        )}

        <div className="edu-grid-layout">
          <section className="edu-card edu-card-gold-accent" aria-labelledby="add-instructor-heading">
            <div className="edu-card-header">
              <h2 id="add-instructor-heading" className="edu-card-title">
                <UserPlusIcon /> Add Instructor
              </h2>
              <p className="edu-card-subtitle">
                Register a new instructor account to authorize course creation and academic publishing.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="edu-form" noValidate>
              <div className="edu-field-group">
                <label htmlFor="inst-name" className="edu-label">
                  Full Name <span style={{ color: '#b91c1c' }}>*</span>
                </label>
                <div className="edu-input-wrapper">
                  <span className="edu-input-icon">
                    <UserIcon />
                  </span>
                  <input
                    id="inst-name"
                    name="fullName"
                    type="text"
                    required
                    placeholder="e.g. Dr. Arthur Pendelton"
                    className="edu-input"
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="edu-field-group">
                <label htmlFor="inst-email" className="edu-label">
                  Email Address <span style={{ color: '#b91c1c' }}>*</span>
                </label>
                <div className="edu-input-wrapper">
                  <span className="edu-input-icon">
                    <MailIcon />
                  </span>
                  <input
                    id="inst-email"
                    name="email"
                    type="email"
                    required
                    placeholder="instructor@university.edu"
                    className="edu-input"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="edu-field-group">
                <label htmlFor="inst-password" className="edu-label">
                  Password <span style={{ color: '#b91c1c' }}>*</span>
                </label>
                <div className="edu-input-wrapper">
                  <span className="edu-input-icon">
                    <LockIcon />
                  </span>
                  <input
                    id="inst-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    className="edu-input"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    className="edu-password-toggle"
                    onClick={() => setShowPassword((prev) => !prev)}
                    title={showPassword ? 'Hide password' : 'Show password'}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <EyeIcon visible={showPassword} />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="edu-btn-submit"
                disabled={isSubmitting}
              >
                <UserPlusIcon />
                <span>{isSubmitting ? 'Registering...' : 'Register Instructor'}</span>
              </button>
            </form>
          </section>

          <section className="edu-card" aria-labelledby="users-list-heading">
            <div className="edu-tabs-bar">
              <button
                type="button"
                className={`edu-tab-btn ${activeListTab === 'instructors' ? 'active' : ''}`}
                onClick={() => {
                  setActiveListTab('instructors');
                  setSearchQuery('');
                }}
              >
                <AcademicCapIcon />
                <span>Instructors</span>
                <span className="edu-tab-pill">{instructors.length}</span>
              </button>

              <button
                type="button"
                className={`edu-tab-btn ${activeListTab === 'students' ? 'active' : ''}`}
                onClick={() => {
                  setActiveListTab('students');
                  setSearchQuery('');
                }}
              >
                <UsersIcon />
                <span>Students</span>
                <span className="edu-tab-pill">{students.length}</span>
              </button>
            </div>

            {isUsingMock && activeListTab === 'instructors' && (
              <div className="edu-mock-notice">
                <span>ℹ️</span>
                <span>
                  Using mock instructor data. Live records will populate once <code>GET /api/Admin/Instructors</code> is connected.
                </span>
              </div>
            )}

            <div className="edu-list-header">
              <div className="edu-list-title-group">
                <h2 id="users-list-heading" className="edu-card-title">
                  {activeListTab === 'instructors' ? <AcademicCapIcon /> : <UsersIcon />}
                  {activeListTab === 'instructors' ? 'Platform Instructors' : 'Platform Students'}
                </h2>
                <p className="edu-card-subtitle">
                  Showing {filteredUsers.length} registered {activeListTab === 'instructors' ? 'academic instructors' : 'students'}
                </p>
              </div>

              <div className="edu-list-actions">
                <div className="edu-search-box">
                  <span className="edu-input-icon" style={{ left: '0.65rem' }}>
                    <SearchIcon />
                  </span>
                  <input
                    type="text"
                    className="edu-search-input"
                    placeholder={`Search ${activeListTab}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {activeListTab === 'instructors' && (
                  <button
                    type="button"
                    className="edu-btn-icon"
                    onClick={fetchInstructors}
                    title="Refresh List"
                    disabled={isLoadingList}
                  >
                    <RefreshIcon />
                  </button>
                )}
              </div>
            </div>

            <div className="edu-table-container">
              {filteredUsers.length > 0 ? (
                <table className="edu-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Department / Major</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, index) => {
                      const name = user.fullName || user.name || 'Unnamed';
                      const email = user.email || '—';
                      const dept = user.department || (activeListTab === 'instructors' ? 'Academic Staff' : 'General Studies');
                      const roleName = activeListTab === 'instructors' ? 'Instructor' : 'Student';
                      const initials = name
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase();

                      return (
                        <tr key={user.id || index}>
                          <td>
                            <div className="edu-user-cell">
                              <div
                                className={`edu-avatar ${activeListTab === 'students' ? 'edu-avatar-student' : ''}`}
                                aria-hidden="true"
                              >
                                {initials || 'US'}
                              </div>
                              <div>
                                <span className="edu-user-name">{name}</span>
                                <span className="edu-user-id">{user.id || `ID: #${index + 1}`}</span>
                              </div>
                            </div>
                          </td>
                          <td>{email}</td>
                          <td>{dept}</td>
                          <td>
                            <span className={`edu-role-badge ${activeListTab === 'students' ? 'edu-role-badge-student' : ''}`}>
                              {roleName}
                            </span>
                          </td>
                          <td>
                            <span className="edu-status-badge">
                              <span className="edu-status-dot" />
                              {user.status || 'Active'}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              type="button"
                              className="edu-btn-delete"
                              onClick={() => handleDeleteUser(user.id, roleName)}
                              title={`Delete ${name}`}
                            >
                              <TrashIcon />
                              <span>Delete</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="edu-empty-state">
                  <div className="edu-empty-icon">
                    <UserIcon />
                  </div>
                  <h3 style={{ margin: '0 0 0.5rem', color: '#1e293b', fontSize: '1.1rem' }}>
                    No {activeListTab === 'instructors' ? 'Instructors' : 'Students'} Found
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.875rem' }}>
                    {searchQuery
                      ? `No records matching "${searchQuery}".`
                      : `No ${activeListTab} registered yet.`}
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
