import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from './Navbar';
import api from '../api/api';

const MOCK_MY_COURSES = [
  {
    id: 1,
    title: 'INTRODUCTION DOT NET',
    instructorName: 'Mahmoud Backend Engineer',
    category: 'Backend Development',
    tag: 'AI Enabled',
    description: 'A comprehensive introduction to the .NET ecosystem — covering C# fundamentals, ASP.NET Core, Entity Framework, and REST API development.',
    progress: 0,
    totalLessons: 12,
    completedLessons: 0,
    thumbnailColor: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
  },
];

const BookOpenIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const PlayIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const UserIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const SparklesIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
  </svg>
);

const GraduationCap = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

export default function MyCourses() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUsingMock, setIsUsingMock] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchMyCourses() {
      setLoading(true);
      try {
        const token = localStorage.getItem('edu_token');
        const response = await api.get('/api/Courses/MyCourses', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (isMounted) {
          if (response.data && Array.isArray(response.data) && response.data.length > 0) {
            setCourses(response.data);
            setIsUsingMock(false);
          } else {
            setCourses(MOCK_MY_COURSES);
            setIsUsingMock(true);
          }
        }
      } catch (err) {
        console.info('MyCourses API pending or unreachable, using fallback enrolled courses:', err.message);
        if (isMounted) {
          setCourses(MOCK_MY_COURSES);
          setIsUsingMock(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchMyCourses();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredCourses = courses.filter((c) => {
    const title = c.title || c.name || '';
    const instructor = c.instructorName || c.instructor || '';
    const q = searchQuery.toLowerCase();
    return title.toLowerCase().includes(q) || instructor.toLowerCase().includes(q);
  });

  return (
    <div className="edu-mycourses-root">
      <Navbar />

      <style>{`
        .edu-mycourses-root {
          min-height: 100vh;
          background-color: #fdfbf7;
          color: #0f172a;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          box-sizing: border-box;
          background-image: 
            radial-gradient(#e5e0d4 0.75px, transparent 0.75px),
            radial-gradient(#e5e0d4 0.75px, #fdfbf7 0.75px);
          background-size: 30px 30px;
          background-position: 0 0, 15px 15px;
        }

        .edu-mycourses-content {
          max-width: 1240px;
          margin: 0 auto;
          padding: 3rem 1.5rem 5rem;
        }

        .edu-page-hero {
          margin-bottom: 2.5rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid #e9e4d9;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1.5rem;
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

        .edu-hero-title {
          font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
          font-size: 2.4rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 0.5rem 0;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }

        .edu-hero-subtitle {
          font-size: 1.05rem;
          color: #64748b;
          margin: 0;
          max-width: 580px;
          line-height: 1.5;
        }

        .edu-hero-stats {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .edu-stat-box {
          background: #ffffff;
          padding: 0.85rem 1.25rem;
          border-radius: 12px;
          border: 1px solid #e8e4dc;
          box-shadow: 0 2px 6px rgba(15, 23, 42, 0.04);
          text-align: center;
        }

        .edu-stat-number {
          font-size: 1.4rem;
          font-weight: 700;
          color: #0f172a;
          font-family: 'Playfair Display', Georgia, serif;
          display: block;
        }

        .edu-stat-label {
          font-size: 0.75rem;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
        }

        .edu-controls-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .edu-search-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
          max-width: 340px;
        }

        .edu-search-icon {
          position: absolute;
          left: 0.9rem;
          color: #94a3b8;
          display: flex;
          align-items: center;
          pointer-events: none;
        }

        .edu-search-input {
          width: 100%;
          padding: 0.65rem 0.85rem 0.65rem 2.45rem;
          font-size: 0.875rem;
          color: #0f172a;
          background: #ffffff;
          border: 1px solid #dcd7cc;
          border-radius: 8px;
          outline: none;
          transition: all 0.2s ease;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);
        }

        .edu-search-input:focus {
          border-color: #c9aa5a;
          box-shadow: 0 0 0 3px rgba(201, 170, 90, 0.2);
        }

        .edu-browse-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          color: #0f172a;
          background: #ffffff;
          border: 1px solid #dcd7cc;
          font-size: 0.875rem;
          font-weight: 600;
          padding: 0.6rem 1.15rem;
          border-radius: 8px;
          text-decoration: none;
          transition: all 0.2s ease;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
        }

        .edu-browse-btn:hover {
          background: #f8f6f0;
          border-color: #c9aa5a;
          transform: translateY(-1px);
        }

        .edu-courses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 1.75rem;
        }

        .edu-course-card {
          background: #ffffff;
          border-radius: 14px;
          border: 1px solid #e8e4dc;
          box-shadow: 0 4px 18px -2px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(15, 23, 42, 0.03);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: all 0.25s ease;
          position: relative;
        }

        .edu-course-card:hover {
          transform: translateY(-4px);
          border-color: #c9aa5a;
          box-shadow: 0 12px 28px -4px rgba(15, 23, 42, 0.12), 0 2px 8px rgba(15, 23, 42, 0.05);
        }

        .edu-card-poster {
          height: 120px;
          background: #0f172a;
          position: relative;
          display: flex;
          align-items: flex-end;
          padding: 1rem;
          overflow: hidden;
        }

        .edu-poster-overlay {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(rgba(201, 170, 90, 0.2) 1px, transparent 1px);
          background-size: 16px 16px;
          opacity: 0.6;
        }

        .edu-poster-icon {
          position: absolute;
          right: 1.25rem;
          top: 1.25rem;
          color: rgba(201, 170, 90, 0.35);
        }

        .edu-category-chip {
          position: relative;
          z-index: 1;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #fef3c7;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(4px);
          padding: 0.25rem 0.65rem;
          border-radius: 9999px;
          border: 1px solid rgba(254, 243, 199, 0.3);
        }

        .edu-card-body {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          flex: 1;
          gap: 1rem;
        }

        .edu-card-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
          line-height: 1.35;
          letter-spacing: -0.01em;
        }

        .edu-card-instructor {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          color: #64748b;
          font-size: 0.825rem;
          font-weight: 500;
        }

        .edu-card-desc {
          font-size: 0.85rem;
          color: #475569;
          line-height: 1.5;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .edu-progress-wrapper {
          margin-top: auto;
          padding-top: 0.75rem;
          border-top: 1px solid #f1ece4;
        }

        .edu-progress-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.78rem;
          font-weight: 600;
          color: #64748b;
          margin-bottom: 0.4rem;
        }

        .edu-progress-percentage {
          color: #b45309;
          font-weight: 700;
        }

        .edu-progress-track {
          width: 100%;
          height: 7px;
          background: #e2e8f0;
          border-radius: 9999px;
          overflow: hidden;
          position: relative;
        }

        .edu-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #d97706 0%, #f59e0b 100%);
          border-radius: 9999px;
          transition: width 0.4s ease;
        }

        .edu-card-footer {
          padding: 1rem 1.5rem 1.25rem;
          background: #faf8f5;
          border-top: 1px solid #f1ece4;
        }

        .edu-btn-action {
          width: 100%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
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
        }

        .edu-btn-action:hover {
          background: #1e293b;
          border-color: #c9aa5a;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.18);
          transform: translateY(-1px);
        }

        .edu-ai-badge {
          position: absolute;
          top: 0.85rem;
          left: 1rem;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: #0f172a;
          background: linear-gradient(135deg, #c9aa5a, #f0cc76);
          padding: 0.22rem 0.6rem;
          border-radius: 9999px;
          box-shadow: 0 2px 8px rgba(201,170,90,0.45);
          animation: aiBadgePulse 2.5s ease-in-out infinite;
        }

        @keyframes aiBadgePulse {
          0%, 100% { box-shadow: 0 2px 8px rgba(201,170,90,0.45); }
          50%       { box-shadow: 0 2px 16px rgba(201,170,90,0.75); }
        }

        .edu-skeleton-card {
          background: #ffffff;
          border-radius: 14px;
          border: 1px solid #e8e4dc;
          overflow: hidden;
          height: 380px;
          display: flex;
          flex-direction: column;
          animation: pulse 1.5s infinite ease-in-out;
        }

        .edu-skeleton-poster {
          height: 120px;
          background: #f1ece4;
        }

        .edu-skeleton-content {
          padding: 1.5rem;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .edu-skeleton-line {
          height: 14px;
          background: #f1ece4;
          border-radius: 6px;
        }

        .edu-skeleton-line.short { width: 45%; }
        .edu-skeleton-line.medium { width: 75%; height: 20px; }
        .edu-skeleton-line.full { width: 100%; }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.55; }
        }

        .edu-empty-wrapper {
          text-align: center;
          padding: 5rem 1.5rem;
          background: #ffffff;
          border: 1px dashed #dcd7cc;
          border-radius: 16px;
          max-width: 580px;
          margin: 0 auto;
        }

        .edu-empty-icon {
          width: 56px;
          height: 56px;
          margin: 0 auto 1.25rem;
          color: #cbd5e1;
        }

        .edu-empty-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.5rem;
          color: #0f172a;
          margin: 0 0 0.5rem 0;
        }

        .edu-empty-text {
          font-size: 0.95rem;
          color: #64748b;
          margin: 0 0 1.75rem 0;
          line-height: 1.5;
        }
      `}</style>

      <main className="edu-mycourses-content">
        <section className="edu-page-hero">
          <div>
            <span className="edu-badge-tag">
              <GraduationCap /> Student Portal
            </span>
            <h1 className="edu-hero-title">My Learning Dashboard</h1>
            <p className="edu-hero-subtitle">
              Access your enrolled classrooms, track modular progress, and resume coursework where you left off.
            </p>
          </div>

          <div className="edu-hero-stats">
            <div className="edu-stat-box">
              <span className="edu-stat-number">{courses.length}</span>
              <span className="edu-stat-label">Enrolled</span>
            </div>
            <div className="edu-stat-box">
              <span className="edu-stat-number">
                {courses.filter((c) => (c.progress ?? 0) === 100).length}
              </span>
              <span className="edu-stat-label">Completed</span>
            </div>
          </div>
        </section>

        <div className="edu-controls-bar">
          <div className="edu-search-wrapper">
            <span className="edu-search-icon">
              <SearchIcon />
            </span>
            <input
              type="text"
              className="edu-search-input"
              placeholder="Filter enrolled courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Filter enrolled courses"
            />
          </div>

          <Link to="/courses" className="edu-browse-btn">
            <SparklesIcon />
            <span>Explore Course Catalog</span>
          </Link>
        </div>

        {loading ? (
          <div className="edu-courses-grid">
            {[1, 2, 3].map((n) => (
              <div key={n} className="edu-skeleton-card">
                <div className="edu-skeleton-poster" />
                <div className="edu-skeleton-content">
                  <div className="edu-skeleton-line short" />
                  <div className="edu-skeleton-line medium" />
                  <div className="edu-skeleton-line full" />
                  <div className="edu-skeleton-line short" style={{ marginTop: 'auto' }} />
                </div>
              </div>
            ))}
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="edu-courses-grid">
            {filteredCourses.map((course) => {
              const courseId = course.id || course.courseId || course.Id;
              const courseTitle = course.title || course.name || course.Title || 'Untitled Course';
              const instructor = course.instructorName || course.instructor || course.InstructorName || 'Faculty Instructor';
              const category = course.category || course.Category || 'Academic Program';
              const description = course.description || course.Description || 'Course overview and learning objectives.';
              const progressVal = Number(course.progress ?? 0);

              const isCompleted = progressVal === 100;
              const hasStarted = progressVal > 0;
              const actionLabel = hasStarted ? 'Continue Learning' : 'Start Learning';

              return (
                <article
                  key={courseId}
                  className="edu-course-card"
                  aria-labelledby={`course-title-${courseId}`}
                >
                  <div
                    className="edu-card-poster"
                    style={{ background: course.thumbnailColor || '#0f172a' }}
                  >
                    <div className="edu-poster-overlay" />
                    <div className="edu-poster-icon">
                      <BookOpenIcon />
                    </div>
                    {course.tag && (
                      <span className="edu-ai-badge">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                        </svg>
                        {course.tag}
                      </span>
                    )}
                    <span className="edu-category-chip">{category}</span>
                  </div>

                  <div className="edu-card-body">
                    <h2 id={`course-title-${courseId}`} className="edu-card-title">
                      {courseTitle}
                    </h2>

                    <div className="edu-card-instructor">
                      <UserIcon />
                      <span>{instructor}</span>
                    </div>

                    <p className="edu-card-desc">{description}</p>

                    <div className="edu-progress-wrapper">
                      <div className="edu-progress-header">
                        <span>Course Progress</span>
                        <span className="edu-progress-percentage">{progressVal}%</span>
                      </div>
                      <div
                        className="edu-progress-track"
                        role="progressbar"
                        aria-valuenow={progressVal}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <div
                          className="edu-progress-fill"
                          style={{ width: `${Math.min(100, Math.max(0, progressVal))}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="edu-card-footer">
                    <button
                      type="button"
                      className="edu-btn-action"
                      onClick={() => navigate('/learn/1')}
                    >
                      <PlayIcon />
                      <span>Start Learning</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="edu-empty-wrapper">
            <div className="edu-empty-icon">
              <BookOpenIcon />
            </div>
            <h3 className="edu-empty-title">
              {searchQuery ? 'No Matching Courses Found' : 'No Enrolled Courses Yet'}
            </h3>
            <p className="edu-empty-text">
              {searchQuery
                ? `No enrolled courses matched your search "${searchQuery}".`
                : 'You have not enrolled in any academic courses yet. Discover our catalog and begin your journey.'}
            </p>
            <Link to="/courses" className="edu-browse-btn" style={{ background: '#0f172a', color: '#fff' }}>
              Explore Available Courses
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
