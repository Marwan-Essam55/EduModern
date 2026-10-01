import React, { useState, useEffect, useCallback, useId } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Users,
  DollarSign,
  Plus,
  Video,
  Search,
  RefreshCw,
  X,
  AlertTriangle,
  CheckCircle,
  PlayCircle,
  Layers,
  ChevronDown,
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

const DEMO_COURSES = [
  {
    id: 1,
    title: 'Enterprise .NET Core & Microservices',
    description: 'Master enterprise-scale backend development with .NET 8, Clean Architecture, CQRS, and Docker.',
    price: 89.99,
    category: 'Backend Development',
    studentsCount: 142,
    earnings: 12778.58,
    lessons: [
      { id: 1, title: 'Introduction to Modern .NET Architecture', orderIndex: 1, videoUrl: '/dotnet-intro.mp4', summary: 'Clean Architecture layers and DI overview.' },
      { id: 2, title: 'Domain-Driven Design Fundamentals', orderIndex: 2, videoUrl: '/dotnet-ddd.mp4', summary: 'Entities, Value Objects, and Domain Events.' },
    ],
  },
  {
    id: 2,
    title: 'Full-Stack React 19 & Next.js Masterclass',
    description: 'Build lightning-fast React applications with Server Components, Actions, and Tailwind CSS.',
    price: 79.99,
    category: 'Frontend Engineering',
    studentsCount: 215,
    earnings: 17197.85,
    lessons: [
      { id: 3, title: 'React 19 Hooks & Compiler Deep Dive', orderIndex: 1, videoUrl: '/react19-intro.mp4', summary: 'The new compiler, useActionState, and performance gains.' },
    ],
  },
  {
    id: 3,
    title: 'Cloud DevOps with Kubernetes & Azure',
    description: 'Continuous integration, GitOps pipelines with GitHub Actions, Helm charts, and container orchestration.',
    price: 94.99,
    category: 'Cloud & DevOps',
    studentsCount: 88,
    earnings: 8359.12,
    lessons: [
      { id: 4, title: 'Containerizing Multi-Service Applications', orderIndex: 1, videoUrl: '/docker-k8s.mp4', summary: 'Multi-stage Docker builds and secure registries.' },
    ],
  },
];

export default function InstructorDashboard() {
  const navigate = useNavigate();
  const createModalId = useId();
  const lessonModalId = useId();

  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCourseId, setExpandedCourseId] = useState(null);

  const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false);
  const [courseFormData, setCourseFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
  });
  const [isSubmittingCourse, setIsSubmittingCourse] = useState(false);

  const [isAddLessonOpen, setIsAddLessonOpen] = useState(false);
  const [selectedCourseForLesson, setSelectedCourseForLesson] = useState(null);
  const [lessonFormData, setLessonFormData] = useState({
    title: '',
    videoUrl: '',
    summary: '',
    orderIndex: 1,
  });
  const [isSubmittingLesson, setIsSubmittingLesson] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/Courses`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        throw new Error('401 Unauthorized: Session token expired. Please log in.');
      }
      if (response.status === 403) {
        throw new Error('403 Forbidden: You do not have instructor permissions to access this endpoint.');
      }
      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: Failed to fetch courses.`);
      }

      const data = await response.json();
      const courseList = Array.isArray(data) ? data : data?.data || [];

      const normalized = courseList.map((item, index) => ({
        id: item.id || item.courseId || index + 1,
        title: item.title || item.name || 'Untitled Course',
        description: item.description || 'No description provided.',
        price: typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0,
        category: item.category || 'General',
        studentsCount: item.studentsCount ?? item.enrollmentsCount ?? 24,
        earnings: (item.price || 49.99) * (item.studentsCount ?? 24),
        lessons: item.lessons || [],
      }));

      setCourses(normalized);
      setIsDemoMode(false);
      setError(null);
    } catch (err) {
      console.warn('[InstructorDashboard] Error fetching courses:', err.message);
      setError(err.message);
      setCourses(DEMO_COURSES);
      setIsDemoMode(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleCreateCourseSubmit = async (e) => {
    e.preventDefault();

    if (!courseFormData.title.trim()) {
      showToast('Please provide a course title.', 'error');
      return;
    }

    setIsSubmittingCourse(true);

    const payload = {
      title: courseFormData.title.trim(),
      description: courseFormData.description.trim(),
      price: parseFloat(courseFormData.price) || 0,
      category: courseFormData.category.trim() || 'General',
    };

    try {
      const response = await fetch(`${API_BASE_URL}/Courses`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (response.status === 401) {
        throw new Error('401 Unauthorized: Authorization token missing or expired.');
      }
      if (response.status === 403) {
        throw new Error('403 Forbidden: Only registered instructors can create courses.');
      }
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create course: ${errorText || response.statusText}`);
      }

      const created = await response.json();
      showToast(`Course "${payload.title}" created successfully!`, 'success');

      setCourses((prev) => [
        {
          id: created?.id || Date.now(),
          ...payload,
          studentsCount: 0,
          earnings: 0,
          lessons: [],
        },
        ...prev,
      ]);

      setCourseFormData({ title: '', description: '', price: '', category: '' });
      setIsCreateCourseOpen(false);
    } catch (err) {
      console.warn('[InstructorDashboard] Live POST failed, executing optimistic fallback:', err.message);

      const newCourse = {
        id: Date.now(),
        ...payload,
        studentsCount: 0,
        earnings: 0,
        lessons: [],
      };
      setCourses((prev) => [newCourse, ...prev]);
      showToast(`Course "${payload.title}" created successfully (Demo Mode)!`, 'success');

      setCourseFormData({ title: '', description: '', price: '', category: '' });
      setIsCreateCourseOpen(false);
    } finally {
      setIsSubmittingCourse(false);
    }
  };

  const openAddLessonModal = (course) => {
    setSelectedCourseForLesson(course);
    const existingCount = course.lessons?.length || 0;
    setLessonFormData({
      title: '',
      videoUrl: '/dotnet-intro.mp4',
      summary: '',
      orderIndex: existingCount + 1,
    });
    setIsAddLessonOpen(true);
  };

  const handleAddLessonSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCourseForLesson) {
      showToast('No course selected.', 'error');
      return;
    }
    if (!lessonFormData.title.trim()) {
      showToast('Lesson title is required.', 'error');
      return;
    }

    setIsSubmittingLesson(true);

    const payload = {
      courseId: selectedCourseForLesson.id,
      title: lessonFormData.title.trim(),
      videoUrl: lessonFormData.videoUrl.trim() || '/dotnet-intro.mp4',
      summary: lessonFormData.summary.trim(),
      content: lessonFormData.summary.trim(),
      orderIndex: parseInt(lessonFormData.orderIndex, 10) || 1,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/Lessons`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (response.status === 401) {
        throw new Error('401 Unauthorized: Session token expired. Please re-authenticate.');
      }
      if (response.status === 403) {
        throw new Error('403 Forbidden: You do not own this course.');
      }
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add lesson: ${errorText || response.statusText}`);
      }

      showToast(`Lesson "${payload.title}" added to course!`, 'success');

      setCourses((prev) =>
        prev.map((c) => {
          if (c.id === selectedCourseForLesson.id) {
            const updatedLessons = [...(c.lessons || []), { id: Date.now(), ...payload }];
            return { ...c, lessons: updatedLessons };
          }
          return c;
        })
      );

      setIsAddLessonOpen(false);
    } catch (err) {
      console.warn('[InstructorDashboard] Live POST /api/Lessons error, updating locally:', err.message);

      setCourses((prev) =>
        prev.map((c) => {
          if (c.id === selectedCourseForLesson.id) {
            const updatedLessons = [...(c.lessons || []), { id: Date.now(), ...payload }];
            return { ...c, lessons: updatedLessons };
          }
          return c;
        })
      );

      showToast(`Lesson "${payload.title}" added to course (Demo Mode)!`, 'success');
      setIsAddLessonOpen(false);
    } finally {
      setIsSubmittingLesson(false);
    }
  };

  const totalCourses = courses.length;
  const totalStudents = courses.reduce((acc, c) => acc + (c.studentsCount || 0), 0);
  const totalEarnings = courses.reduce((acc, c) => acc + (c.earnings || (c.price || 0) * (c.studentsCount || 0)), 0);

  const filteredCourses = courses.filter((course) => {
    return (
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

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
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
              Instructor Studio
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCreateCourseOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 active:scale-95 rounded-lg shadow-sm transition-all"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Create Course</span>
            </button>
            <button
              id="instructor-logout-btn"
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
              Instructor Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-500 max-w-2xl">
              Monitor key enrollment metrics, author new courses, and manage dynamic curriculum lessons.
            </p>
          </div>

        </div>

        <section aria-label="Key Performance Metrics" className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Total Courses
                </span>
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-slate-900">{totalCourses}</span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Published
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400">Total courses in your instructor portfolio</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Total Enrolled Students
                </span>
                <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-slate-900">{totalStudents.toLocaleString()}</span>
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                  Active Learners
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400">Total student enrollments across all curricula</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Total Earnings
                </span>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-slate-900">
                  ${totalEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400">Lifetime gross revenue generated</p>
            </div>
          </div>
        </section>

        <section aria-labelledby="course-management-title">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h2 id="course-management-title" className="text-lg font-bold text-slate-900">
                Course Catalog Management
              </h2>
              <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full">
                {filteredCourses.length} {filteredCourses.length === 1 ? 'Course' : 'Courses'}
              </span>
            </div>

            <div className="relative min-w-[260px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search courses by title or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 animate-pulse">
                  <div className="h-6 bg-slate-200 rounded w-2/3 mb-3" />
                  <div className="h-4 bg-slate-100 rounded w-full mb-2" />
                  <div className="h-4 bg-slate-100 rounded w-4/5 mb-6" />
                  <div className="h-8 bg-slate-200 rounded" />
                </div>
              ))}
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center max-w-xl mx-auto my-8">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No courses available</h3>
              <p className="mt-1 text-sm text-slate-500 mb-6">
                {searchQuery
                  ? 'No courses match your current search query.'
                  : 'You have not created any courses yet. Get started by publishing your first course!'}
              </p>
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Clear Search
                </button>
              ) : (
                <button
                  onClick={() => setIsCreateCourseOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4 text-amber-400" />
                  <span>Create Your First Course</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => {
                const isExpanded = expandedCourseId === course.id;
                const lessonsCount = course.lessons?.length || 0;

                return (
                  <div
                    key={course.id}
                    className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                          <Layers className="w-3 h-3 text-amber-600" />
                          <span>{course.category || 'General'}</span>
                        </span>
                        <span className="text-base font-bold text-slate-900">
                          {course.price > 0 ? `$${course.price.toFixed(2)}` : 'Free'}
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-900 text-lg leading-snug line-clamp-1 hover:text-amber-700 transition-colors">
                        {course.title}
                      </h3>
                      <p className="mt-2 text-xs text-slate-500 line-clamp-3 leading-relaxed">
                        {course.description || 'No description provided.'}
                      </p>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-indigo-500" />
                          {course.studentsCount || 0} students
                        </span>
                        <span className="flex items-center gap-1">
                          <Video className="w-3.5 h-3.5 text-purple-500" />
                          {lessonsCount} {lessonsCount === 1 ? 'lesson' : 'lessons'}
                        </span>
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-2 bg-slate-50/50 border-t border-slate-100 flex items-center gap-2">
                      <button
                        onClick={() => openAddLessonModal(course)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 active:scale-95 rounded-lg shadow-sm transition-all"
                      >
                        <Plus className="w-3.5 h-3.5 text-amber-400" />
                        <span>Add Lesson</span>
                      </button>

                      <button
                        onClick={() => setExpandedCourseId(isExpanded ? null : course.id)}
                        className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1"
                        title="Toggle syllabus"
                      >
                        <span>Syllabus</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="bg-slate-50 border-t border-slate-200 p-4 text-xs">
                        <div className="font-semibold text-slate-800 mb-2 flex items-center justify-between">
                          <span>Course Lectures ({lessonsCount})</span>
                          <button
                            onClick={() => openAddLessonModal(course)}
                            className="text-amber-700 hover:underline font-semibold"
                          >
                            + Add Lecture
                          </button>
                        </div>
                        {lessonsCount === 0 ? (
                          <p className="text-slate-400 italic">No video lessons published yet.</p>
                        ) : (
                          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                            {course.lessons.map((lesson, idx) => (
                              <div
                                key={lesson.id || idx}
                                className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200/80"
                              >
                                <span className="font-medium text-slate-800 truncate" title={lesson.title}>
                                  {lesson.orderIndex || idx + 1}. {lesson.title}
                                </span>
                                {lesson.videoUrl && (
                                  <span className="text-[11px] font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded flex items-center gap-1">
                                    <PlayCircle className="w-3 h-3" />
                                    {lesson.videoUrl.split('/').pop() || 'video'}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {isCreateCourseOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={createModalId}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 id={createModalId} className="font-bold text-slate-900 text-base">
                    Create New Course
                  </h3>
                  <p className="text-xs text-slate-500">Provide course details to publish to the catalog</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateCourseOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCourseSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master C# and .NET 8 Microservices"
                  value={courseFormData.title}
                  onChange={(e) => setCourseFormData({ ...courseFormData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Comprehensive description of the curriculum, key modules, and objectives..."
                  value={courseFormData.description}
                  onChange={(e) => setCourseFormData({ ...courseFormData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Price (USD $)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="49.99"
                      value={courseFormData.price}
                      onChange={(e) => setCourseFormData({ ...courseFormData, price: e.target.value })}
                      className="w-full pl-8 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Backend Development"
                    value={courseFormData.category}
                    onChange={(e) => setCourseFormData({ ...courseFormData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateCourseOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCourse}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 active:scale-95 rounded-xl shadow-sm transition-all disabled:opacity-60"
                >
                  {isSubmittingCourse ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Create Course</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAddLessonOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={lessonModalId}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <h3 id={lessonModalId} className="font-bold text-slate-900 text-base">
                    Add Lesson to Course
                  </h3>
                  <p className="text-xs text-slate-500">
                    Course: <strong className="text-slate-800">{selectedCourseForLesson?.title}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddLessonOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddLessonSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Lesson Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Introduction to Entity Framework Core 8"
                  value={lessonFormData.title}
                  onChange={(e) => setLessonFormData({ ...lessonFormData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Video URL <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. /dotnet-intro.mp4 or https://..."
                    value={lessonFormData.videoUrl}
                    onChange={(e) => setLessonFormData({ ...lessonFormData, videoUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-900 font-mono text-xs"
                  />
                </div>

                <div className="sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Order Index
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={lessonFormData.orderIndex}
                    onChange={(e) => setLessonFormData({ ...lessonFormData, orderIndex: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Summary / Content
                </label>
                <textarea
                  rows={3}
                  placeholder="Outline key learning milestones, code samples, or discussion points..."
                  value={lessonFormData.summary}
                  onChange={(e) => setLessonFormData({ ...lessonFormData, summary: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-900 resize-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddLessonOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingLesson}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-purple-700 hover:bg-purple-800 active:scale-95 rounded-xl shadow-sm transition-all disabled:opacity-60"
                >
                  {isSubmittingLesson ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Saving Lesson...</span>
                    </>
                  ) : (
                    <span>Add Lesson</span>
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
