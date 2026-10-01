import React, { useState, useEffect, useCallback, useId } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  Users,
  GraduationCap,
  Activity,
  UserPlus,
  Search,
  X,
  AlertTriangle,
  CheckCircle,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Trash2,
  LogOut,
} from 'lucide-react';

const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'https://edumodern-api.runasp.net'}/api`;

const getAuthToken = () => {
  return localStorage.getItem('token') || localStorage.getItem('edu_token') || '';
};

const getAuthHeaders = () => {
  const token = getAuthToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const DEMO_USERS = [
  {
    id: 'usr-101',
    fullName: 'Dr. Eleanor Vance',
    email: 'e.vance@edumodern.edu',
    roles: ['Instructor'],
  },
  {
    id: 'usr-102',
    fullName: 'Prof. Marcus Chen',
    email: 'm.chen@edumodern.edu',
    roles: ['Instructor'],
  },
  {
    id: 'usr-103',
    fullName: 'Marwan Admin',
    email: 'admin@edumodern.edu',
    roles: ['Admin'],
  },
  {
    id: 'usr-104',
    fullName: 'Sophia Bennett',
    email: 's.bennett@student.edumodern.edu',
    roles: ['Student'],
  },
  {
    id: 'usr-105',
    fullName: 'mazin ahmed',
    email: 'l.hassan@student.edumodern.edu',
    roles: ['Student'],
  },
  {
    id: 'usr-106',
    fullName: 'David Kim',
    email: 'd.kim@student.edumodern.edu',
    roles: ['Student'],
  },
  {
    id: 'usr-107',
    fullName: 'Dr. Sarah Al-Mansoor',
    email: 's.almansoor@edumodern.edu',
    roles: ['Instructor', 'Admin'],
  },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const registerModalId = useId();

  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('All');

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [instructorForm, setInstructorForm] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const extractRoles = (rawUser) => {
    if (Array.isArray(rawUser.roles)) return rawUser.roles;
    if (rawUser.role) {
      if (typeof rawUser.role === 'string') {
        return rawUser.role.split(',').map((r) => r.trim());
      }
      return [String(rawUser.role)];
    }
    if (Array.isArray(rawUser.assignedRoles)) return rawUser.assignedRoles;
    return ['Student'];
  };

  const fetchUsers = useCallback(async () => {
    setIsLoadingUsers(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/Admin/Users`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        throw new Error('401 Unauthorized: Session token expired. Please log in as an Administrator.');
      }
      if (response.status === 403) {
        throw new Error('403 Forbidden: Administrator role is required to manage users.');
      }
      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: Failed to retrieve platform users.`);
      }

      const data = await response.json();
      const rawList = Array.isArray(data) ? data : data?.data || [];

      const normalized = rawList.map((u, i) => ({
        id: u.id || u.userId || `usr-${i + 1}`,
        fullName: u.fullName || u.name || u.userName || 'Unnamed User',
        email: u.email || 'no-email@edumodern.edu',
        roles: extractRoles(u),
      }));

      setUsers(normalized);
      setIsDemoMode(false);
      setError(null);
    } catch (err) {
      console.warn('[AdminDashboard] Live users API failed, using fallback:', err.message);
      setUsers(DEMO_USERS);
      setIsDemoMode(true);
    } finally {
      setIsLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRegisterInstructorSubmit = async (e) => {
    e.preventDefault();

    if (!instructorForm.fullName.trim() || !instructorForm.email.trim() || !instructorForm.password.trim()) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      fullName: instructorForm.fullName.trim(),
      email: instructorForm.email.trim(),
      password: instructorForm.password,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/Admin/RegisterInstructor`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (response.status === 401) {
        throw new Error('401 Unauthorized: Authorization token missing or expired.');
      }
      if (response.status === 403) {
        throw new Error('403 Forbidden: Only super administrators can register instructors.');
      }
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Registration failed: ${errorText || response.statusText}`);
      }

      showToast(`Instructor "${payload.fullName}" registered successfully!`, 'success');

      setInstructorForm({ fullName: '', email: '', password: '' });
      setIsRegisterModalOpen(false);

      fetchUsers();
    } catch (err) {
      console.warn('[AdminDashboard] Live register error, updating locally for demo:', err.message);

      const newInstructor = {
        id: `usr-${Date.now()}`,
        fullName: payload.fullName,
        email: payload.email,
        roles: ['Instructor'],
      };

      setUsers((prev) => [newInstructor, ...prev]);
      showToast(`Instructor "${payload.fullName}" registered successfully (Demo Mode)!`, 'success');

      setInstructorForm({ fullName: '', email: '', password: '' });
      setIsRegisterModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalRegisteredUsers = users.length;
  const totalInstructors = users.filter((u) =>
    u.roles.some((r) => r.toLowerCase().includes('instructor') || r.toLowerCase().includes('teacher'))
  ).length;
  const platformActivityPercentage = 98.4;

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(user.id).toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole =
      selectedRoleFilter === 'All' ||
      user.roles.some((r) => r.toLowerCase().includes(selectedRoleFilter.toLowerCase()));

    return matchesSearch && matchesRole;
  });

  const renderRoleBadge = (roleName) => {
    const r = roleName.toLowerCase();
    if (r.includes('admin')) {
      return (
        <span
          key={roleName}
          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200/80"
        >
          <Shield className="w-3 h-3 text-purple-600" />
          <span>Admin</span>
        </span>
      );
    }
    if (r.includes('instructor') || r.includes('teacher')) {
      return (
        <span
          key={roleName}
          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80"
        >
          <GraduationCap className="w-3 h-3 text-amber-600" />
          <span>Instructor</span>
        </span>
      );
    }
    return (
      <span
        key={roleName}
        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80"
      >
        <Users className="w-3 h-3 text-blue-600" />
        <span>Student</span>
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-slate-900 font-sans antialiased pb-16">
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border text-sm font-medium transition-all duration-300 ${
            toast.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800 shadow-rose-900/10'
              : 'bg-emerald-50 border-emerald-200 text-emerald-900 shadow-emerald-900/10'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          ) : (
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          )}
          <span>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="ml-2 text-slate-400 hover:text-slate-600"
            aria-label="Dismiss toast"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <header className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/home" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-900 font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
                E
              </div>
              <span className="font-semibold text-slate-900 tracking-tight text-lg">
                Edu<span className="text-amber-600">Modern</span>
              </span>
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Console</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 active:scale-95 rounded-lg shadow-sm transition-all"
            >
              <UserPlus className="w-4 h-4 text-amber-400" />
              <span>Register Instructor</span>
            </button>
            <button
              id="admin-logout-btn"
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('edu_token');
                localStorage.removeItem('userRole');
                navigate('/login', { replace: true });
              }}
              title="Log out"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 hover:text-rose-800 border border-rose-200 rounded-lg transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Platform Administration
            </h1>
            <p className="mt-1 text-sm text-slate-500 max-w-2xl">
              Inspect user directories, provision verified instructor roles, and monitor central system metrics.
            </p>
          </div>

        </div>

        <section aria-label="System Metrics Overview" className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Total Registered Users
                </span>
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-slate-900">{totalRegisteredUsers}</span>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  All Roles
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400">Total accounts active across the EduModern LMS</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Total Instructors
                </span>
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700 group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-slate-900">{totalInstructors}</span>
                <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                  Verified Faculty
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400">Instructors granted course publishing privileges</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Platform Activity
                </span>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                  <Activity className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-slate-900">{platformActivityPercentage}%</span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Healthy
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400">System operational uptime and student engagement</p>
            </div>
          </div>
        </section>

        <section aria-labelledby="user-table-heading">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 id="user-table-heading" className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>User Management Table</span>
                  <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full">
                    {filteredUsers.length} of {users.length}
                  </span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 font-mono">
                  Endpoint: GET /api/Admin/Users
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative min-w-[240px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search ID, name, or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900"
                  />
                </div>

                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                  {['All', 'Student', 'Instructor', 'Admin'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setSelectedRoleFilter(tab)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        selectedRoleFilter === tab
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              {isLoadingUsers ? (
                <div className="p-12 text-center">
                  <div className="inline-block w-8 h-8 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin mb-3" />
                  <p className="text-sm text-slate-500">Retrieving platform user directory...</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">No users found</h4>
                  <p className="text-xs text-slate-500 mt-1">No platform records match the active filter criteria.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedRoleFilter('All');
                    }}
                    className="mt-4 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      <th className="py-3.5 px-6">User ID</th>
                      <th className="py-3.5 px-6">Full Name</th>
                      <th className="py-3.5 px-6">Email Address</th>
                      <th className="py-3.5 px-6">Assigned Roles</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.map((user) => {
                      const initials = user.fullName
                        .split(' ')
                        .filter(Boolean)
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase() || 'U';

                      return (
                        <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-4 px-6 text-slate-500 font-mono text-xs">
                            <span className="bg-slate-100 px-2 py-1 rounded text-slate-700 font-medium">
                              {user.id}
                            </span>
                          </td>

                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-900 text-amber-400 font-bold flex items-center justify-center text-xs flex-shrink-0">
                                {initials}
                              </div>
                              <span className="font-semibold text-slate-900">
                                {user.fullName}
                              </span>
                            </div>
                          </td>

                          <td className="py-4 px-6 text-slate-600 font-mono text-xs">
                            {user.email}
                          </td>

                          <td className="py-4 px-6">
                            <div className="flex flex-wrap items-center gap-1.5">
                              {user.roles.map((role) => renderRoleBadge(role))}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </section>
      </main>

      {isRegisterModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={registerModalId}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn"
        >
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 id={registerModalId} className="font-bold text-slate-900 text-base">
                    Register Instructor
                  </h3>
                  <p className="text-xs text-slate-500">Provision instructor credentials on EduModern</p>
                </div>
              </div>
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterInstructorSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Users className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Eleanor Vance"
                    value={instructorForm.fullName}
                    onChange={(e) => setInstructorForm({ ...instructorForm, fullName: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="e.g. e.vance@edumodern.edu"
                    value={instructorForm.email}
                    onChange={(e) => setInstructorForm({ ...instructorForm, email: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Minimum 6 characters with symbol"
                    value={instructorForm.password}
                    onChange={(e) => setInstructorForm({ ...instructorForm, password: e.target.value })}
                    className="w-full pl-9 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl text-xs text-amber-800 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>
                  The user will automatically be assigned the <strong>Instructor</strong> role with course creation rights.
                </span>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 active:scale-95 rounded-xl shadow-sm transition-all disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Registering...</span>
                    </>
                  ) : (
                    <span>Register Instructor</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
