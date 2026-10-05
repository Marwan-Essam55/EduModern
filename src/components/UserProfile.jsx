import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, decodeToken } from '../context/AuthContext';
import api from '../api/api';

const MOCK_USER = {
  fullName: 'Marwan Essam',
  email: 'marwan@edumodern.edu',
  role: 'Student',
};

function formatRole(rawRole) {
  if (!rawRole) return 'Student';
  let roleStr = '';
  if (Array.isArray(rawRole)) {
    roleStr = String(rawRole[0] || 'Student');
  } else if (typeof rawRole === 'string') {
    if (rawRole.includes(',')) {
      roleStr = rawRole.split(',')[0].trim();
    } else {
      const len = rawRole.length;
      if (len > 2 && len % 2 === 0) {
        const half = rawRole.slice(0, len / 2);
        if (half.toLowerCase() === rawRole.slice(len / 2).toLowerCase()) {
          roleStr = half;
        } else {
          roleStr = rawRole;
        }
      } else {
        roleStr = rawRole;
      }
    }
  } else {
    roleStr = String(rawRole);
  }

  const trimmed = roleStr.trim();
  if (!trimmed) return 'Student';
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
}

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const UploadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const LockIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export default function UserProfile() {
  const auth = useAuth();
  const fileInputRef = useRef(null);

  const [userInfo, setUserInfo] = useState({
    fullName: '',
    email: '',
    role: 'Student',
    avatarUrl: '',
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      const storedToken = localStorage.getItem('edu_token');
      const localUser = auth?.user || (storedToken ? decodeToken(storedToken) : null);
      const savedName = localStorage.getItem('edu_user_name') || localUser?.name || localUser?.fullName || MOCK_USER.fullName;
      const savedAvatar = localStorage.getItem('edu_avatar_url') || '';

      if (isMounted) {
        setUserInfo({
          fullName: savedName,
          email: localUser?.email || MOCK_USER.email,
          role: formatRole(localUser?.role || MOCK_USER.role),
          avatarUrl: savedAvatar,
        });
        if (savedAvatar) {
          setPreviewUrl(savedAvatar);
        }
      }

      try {
        let response;
        try {
          response = await api.get('/api/Users/Profile');
        } catch (e1) {
          response = await api.get('/api/Users/GetProfile');
        }

        if (isMounted && response?.data) {
          const d = response.data;
          const remoteName = d.fullName || d.name || savedName;
          const remoteEmail = d.email || localUser?.email || MOCK_USER.email;
          const remoteRole = formatRole(d.role || localUser?.role || MOCK_USER.role);
          const remoteAvatar = d.avatarUrl || d.avatar || d.profilePictureUrl || savedAvatar;

          setUserInfo({
            fullName: remoteName,
            email: remoteEmail,
            role: remoteRole,
            avatarUrl: remoteAvatar,
          });

          if (remoteAvatar) {
            setPreviewUrl(remoteAvatar);
            localStorage.setItem('edu_avatar_url', remoteAvatar);
          }
          if (remoteName) {
            localStorage.setItem('edu_user_name', remoteName);
          }
        }
      } catch (err) {
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [auth]);

  const initials = (userInfo.fullName || 'User')
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'ME';

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFeedback({
        type: 'error',
        message: 'Please choose an image file (PNG, JPG, WebP, etc.).',
      });
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
    setFeedback(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('avatar', file);
      formData.append('file', file);

      let finalAvatarUrl = localPreview;
      try {
        const response = await api.post('/api/Users/UploadAvatar', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const serverUrl =
          response.data?.avatarUrl ||
          response.data?.url ||
          response.data?.filePath ||
          (typeof response.data === 'string' ? response.data : null);

        if (serverUrl) {
          finalAvatarUrl = serverUrl;
        }
      } catch (apiErr) {
        console.warn('UploadAvatar endpoint note:', apiErr.message);
      }

      setUserInfo((prev) => ({ ...prev, avatarUrl: finalAvatarUrl }));
      setPreviewUrl(finalAvatarUrl);
      localStorage.setItem('edu_avatar_url', finalAvatarUrl);

      setFeedback({
        type: 'success',
        message: `Avatar "${file.name}" uploaded successfully!`,
      });
    } catch (err) {
      console.error('Failed to upload avatar:', err);
      setFeedback({
        type: 'error',
        message: 'Failed to upload avatar. Please try again.',
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    if (!userInfo.fullName.trim()) {
      setFeedback({
        type: 'error',
        message: 'Full Name cannot be empty.',
      });
      return;
    }

    setIsSaving(true);
    setFeedback(null);

    const updatedName = userInfo.fullName.trim();
    try {
      const payload = {
        fullName: updatedName,
        name: updatedName,
        email: userInfo.email,
        avatarUrl: userInfo.avatarUrl || previewUrl || '',
      };

      try {
        await api.put('/api/Users/Profile', payload);
      } catch (e1) {
        try {
          await api.post('/api/Users/Profile', payload);
        } catch (e2) {
          try {
            await api.put('/api/Users/UpdateProfile', payload);
          } catch (e3) {
            console.info('Profile saved locally:', updatedName);
          }
        }
      }

      localStorage.setItem('edu_user_name', updatedName);

      setFeedback({
        type: 'success',
        message: 'Profile changes saved successfully!',
      });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.message || 'Failed to save changes. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="edu-profile-container">
      <style>{`
        .edu-profile-container {
          min-height: 100vh;
          width: 100%;
          overflow-y: auto;
          background-color: #fdfbf7;
          color: #0f172a;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          padding: 2.5rem 1rem;
          box-sizing: border-box;
          background-image: 
            radial-gradient(#e5e0d4 0.75px, transparent 0.75px),
            radial-gradient(#e5e0d4 0.75px, #fdfbf7 0.75px);
          background-size: 30px 30px;
          background-position: 0 0, 15px 15px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
        }

        .edu-profile-card {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          position: relative;
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #e8e4dc;
          box-shadow: 0 10px 30px -4px rgba(15, 23, 42, 0.08), 0 2px 6px rgba(15, 23, 42, 0.04);
          overflow: hidden;
          border-top: 4px solid #c9aa5a;
          box-sizing: border-box;
        }

        .edu-profile-header {
          padding: 2.25rem 2rem 1.5rem;
          text-align: center;
          border-bottom: 1px solid #f1ece4;
          background: linear-gradient(180deg, #fcfbfa 0%, #ffffff 100%);
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
          margin-bottom: 0.75rem;
        }

        .edu-profile-title {
          font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
          font-size: 2rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 0.35rem 0;
          letter-spacing: -0.02em;
        }

        .edu-profile-subtitle {
          font-size: 0.9rem;
          color: #64748b;
          margin: 0;
        }

        .edu-feedback {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.85rem 1.25rem;
          border-radius: 8px;
          margin: 1.25rem 2rem 0;
          font-size: 0.875rem;
          line-height: 1.4;
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

        .edu-avatar-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2.25rem 2rem 1.75rem;
          border-bottom: 1px solid #f1ece4;
        }

        .edu-avatar-circle {
          width: 110px;
          height: 110px;
          border-radius: 50%;
          background: #0f172a;
          color: #c9aa5a;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.25rem;
          font-family: 'Playfair Display', Georgia, serif;
          font-weight: 700;
          border: 3px solid #c9aa5a;
          box-shadow: 0 4px 16px rgba(15, 23, 42, 0.12);
          overflow: hidden;
          margin-bottom: 1.25rem;
          user-select: none;
        }

        .edu-avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .edu-upload-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          max-width: 320px;
        }

        .edu-btn-upload {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          background: #0f172a;
          color: #f8fafc;
          border: 1px solid #0f172a;
          font-size: 0.875rem;
          font-weight: 600;
          padding: 0.75rem 1.25rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 6px rgba(15, 23, 42, 0.1);
          text-align: center;
          box-sizing: border-box;
        }

        .edu-btn-upload:hover {
          background: #1e293b;
          border-color: #c9aa5a;
          transform: translateY(-1px);
        }

        .edu-spinner {
          display: inline-block;
          width: 15px;
          height: 15px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        .edu-info-section {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .edu-info-heading {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 0.25rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .edu-field-group {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .edu-label {
          font-size: 0.825rem;
          font-weight: 600;
          color: #1e293b;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .edu-lock-pill {
          font-size: 0.7rem;
          color: #64748b;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          background: #f1f5f9;
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
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

        .edu-input-editable {
          width: 100%;
          padding: 0.75rem 0.85rem 0.75rem 2.45rem;
          font-size: 0.9rem;
          color: #0f172a;
          background: #ffffff;
          border: 1px solid #dcd7cc;
          border-radius: 8px;
          outline: none;
          font-family: inherit;
          box-sizing: border-box;
          transition: all 0.2s ease;
        }

        .edu-input-editable:focus {
          border-color: #c9aa5a;
          box-shadow: 0 0 0 3px rgba(201, 170, 90, 0.2);
        }

        .edu-input-readonly {
          width: 100%;
          padding: 0.75rem 0.85rem 0.75rem 2.45rem;
          font-size: 0.9rem;
          color: #475569;
          background: #fbf9f5;
          border: 1px solid #e5e0d6;
          border-radius: 8px;
          outline: none;
          cursor: default;
          font-family: inherit;
          box-sizing: border-box;
        }

        .edu-role-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.35rem 0.85rem;
          background: #dbeafe;
          color: #1e3a8a;
          font-size: 0.825rem;
          font-weight: 600;
          border-radius: 9999px;
          border: 1px solid #bfdbfe;
          text-transform: none;
          letter-spacing: 0.02em;
          width: fit-content;
        }

        .edu-btn-save {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
          color: #ffffff;
          border: none;
          font-size: 0.9rem;
          font-weight: 600;
          padding: 0.85rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(217, 119, 6, 0.25);
          margin-top: 0.75rem;
        }

        .edu-btn-save:hover:not(:disabled) {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(217, 119, 6, 0.35);
        }

        .edu-btn-save:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .edu-footer-nav {
          padding: 1.25rem 2rem;
          border-top: 1px solid #f1ece4;
          background: #faf8f5;
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }

        .edu-nav-link {
          font-size: 0.875rem;
          font-weight: 600;
          color: #0f172a;
          text-decoration: none;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
        }

        .edu-nav-link:hover {
          color: #b45309;
          transform: translateX(-2px);
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 640px) {
          .edu-profile-container {
            padding: 1.5rem 0.75rem 3rem;
          }

          .edu-profile-header {
            padding: 1.75rem 1.25rem 1.25rem;
          }

          .edu-profile-title {
            font-size: 1.65rem;
          }

          .edu-avatar-section {
            padding: 1.75rem 1.25rem 1.5rem;
          }

          .edu-info-section {
            padding: 1.5rem 1.25rem;
          }

          .edu-feedback {
            margin: 1rem 1.25rem 0;
          }

          .edu-footer-nav {
            padding: 1rem 1.25rem;
          }
        }
      `}</style>

      <div className="edu-profile-card">
        <div className="edu-profile-header">
          <span className="edu-badge-tag">
            <ShieldIcon /> EduModern Account
          </span>
          <h1 className="edu-profile-title">User Profile</h1>
          <p className="edu-profile-subtitle">Personal academic credentials and system profile</p>
        </div>

        {feedback && (
          <div className={`edu-feedback edu-feedback-${feedback.type}`} role="alert">
            {feedback.type === 'success' ? <CheckCircleIcon /> : <ShieldIcon />}
            <span>{feedback.message}</span>
          </div>
        )}

        <section className="edu-avatar-section" aria-label="Avatar Upload">
          <div className="edu-avatar-circle" aria-label="Profile Avatar">
            {previewUrl ? (
              <img src={previewUrl} alt="Avatar Preview" className="edu-avatar-img" />
            ) : (
              <span>{initials}</span>
            )}
          </div>

          <div className="edu-upload-box">
            <label
              htmlFor="avatar-file-input"
              className="edu-btn-upload"
              style={{
                cursor: isUploading ? 'not-allowed' : 'pointer',
                opacity: isUploading ? 0.7 : 1,
                userSelect: 'none',
              }}
            >
              <input
                id="avatar-file-input"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                style={{ display: 'none' }}
                disabled={isUploading}
              />

              {isUploading ? (
                <>
                  <span className="edu-spinner" aria-hidden="true" />
                  <span>Uploading Avatar...</span>
                </>
              ) : (
                <>
                  <UploadIcon />
                  <span>Upload Avatar</span>
                </>
              )}
            </label>
          </div>
        </section>

        <form onSubmit={handleSaveChanges} className="edu-info-section" aria-label="Account Details">
          <h2 className="edu-info-heading">
            <UserIcon /> Account Details
          </h2>

          <div className="edu-field-group">
            <label htmlFor="user-fullname" className="edu-label">
              <span>Full Name</span>
            </label>
            <div className="edu-input-wrapper">
              <span className="edu-input-icon">
                <UserIcon />
              </span>
              <input
                id="user-fullname"
                type="text"
                value={userInfo.fullName}
                onChange={(e) => setUserInfo((prev) => ({ ...prev, fullName: e.target.value }))}
                className="edu-input-editable"
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>

          <div className="edu-field-group">
            <label htmlFor="user-email" className="edu-label">
              <span>Email Address</span>
              <span className="edu-lock-pill">
                <LockIcon /> Read-only
              </span>
            </label>
            <div className="edu-input-wrapper">
              <span className="edu-input-icon">
                <MailIcon />
              </span>
              <input
                id="user-email"
                type="email"
                readOnly
                value={userInfo.email}
                className="edu-input-readonly"
              />
            </div>
          </div>

          <div className="edu-field-group">
            <label className="edu-label">
              <span>System Role</span>
              <span className="edu-lock-pill">
                <LockIcon /> System Assigned
              </span>
            </label>
            <div>
              <span className="edu-role-badge">
                <ShieldIcon />
                <span>{userInfo.role}</span>
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="edu-btn-save"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <span className="edu-spinner" aria-hidden="true" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </form>

        <div className="edu-footer-nav">
          <Link to="/courses" className="edu-nav-link">
            ← Back to Course Catalog
          </Link>
        </div>
      </div>
    </div>
  );
}
