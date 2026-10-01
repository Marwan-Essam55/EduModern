
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/api';
import s from './LearningRoom.module.css';
import LessonChat from './LessonChat';
import NotesTab from './NotesTab';

const Icon = {
  ArrowLeft: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  Play: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5,3 19,12 5,21" />
    </svg>
  ),
  Check: ({ size = 10 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  ChevronDown: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  Clock: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Film: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
      <line x1="7" y1="2" x2="7" y2="22" /><line x1="17" y1="2" x2="17" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" /><line x1="2" y1="7" x2="7" y2="7" />
      <line x1="2" y1="17" x2="7" y2="17" /><line x1="17" y1="17" x2="22" y2="17" />
      <line x1="17" y1="7" x2="22" y2="7" />
    </svg>
  ),
  MessageCircle: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  FileText: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  BookOpen: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  Users: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  PencilSquare: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
};

const DEFAULT_COURSE_TITLE = "What is .NET? [Pt 1] | .NET for Beginners";

const DEFAULT_LESSONS = [
  {
    id: 1,
    title: "01. What is .NET? [Pt 1]",
    duration: "05:00",
    completed: false,
    orderIndex: 1,
    videoUrl: "/dotnet-intro.mp4",
    content: "What is .NET? An introductory guide covering the .NET ecosystem, Common Language Runtime (CLR), C#, and building high-performance modern applications.",
  },
];

const DEFAULT_COURSE = {
  id: 1,
  title: DEFAULT_COURSE_TITLE,
  instructorName: "Mahmoud Backend Engineer",
};

function buildSections(lessons) {
  const sorted = [...lessons].sort((a, b) => a.orderIndex - b.orderIndex);
  return [
    {
      id: 'section-1',
      title: 'Course Lessons',
      lessons: sorted,
    },
  ];
}

function LearningHeader({ courseTitle, progress, onBack }) {
  const displayTitle = courseTitle || DEFAULT_COURSE_TITLE;

  return (
    <header className={s.header} role="banner">
      <div className={s.headerLeft}>
        <button
          id="back-to-dashboard-btn"
          className={s.backBtn}
          onClick={onBack}
          aria-label="Back to Courses"
        >
          <Icon.ArrowLeft />
          Courses
        </button>
        <span className={s.headerDivider} aria-hidden="true" />
        <span className={s.headerCourseTitle} title={displayTitle}>
          {displayTitle}
        </span>
      </div>

      <div className={s.headerRight}>
        <div className={s.progressPill} aria-label={`Course progress: ${progress.pct}%`}>
          <span className={s.progressPillDot} />
          {progress.pct}% Complete
        </div>
      </div>
    </header>
  );
}

function VideoPlayer({ lesson, onVideoEnd, videoRef: externalRef }) {
  const internalRef = useRef(null);
  const videoRef = externalRef ?? internalRef;

const videoSrc = lesson?.videoUrl || '/dotnet-intro.mp4';

  return (
    <div className={s.videoWrapper} aria-label={`Video: ${lesson?.title || 'Lesson Video'}`}>
      <video
        ref={videoRef}
        key={videoSrc}
        src={videoSrc}
        controls
        playsInline
        onEnded={onVideoEnd}
        className={s.videoElement}
        aria-label={lesson?.title || "Course Video"}
      >
        Your browser does not support HTML5 video playback.
      </video>
    </div>
  );
}

function OverviewTab({ lesson, instructorName }) {
  return (
    <div>
      <h1 className={s.lessonHeadline}>{lesson?.title || DEFAULT_LESSONS[0].title}</h1>

      <div className={s.lessonMeta}>
        <span className={s.lessonMetaItem}>
          <Icon.Film /> Lesson {lesson?.orderIndex || 1}
        </span>
        {instructorName && (
          <span className={s.lessonMetaItem}>
            <Icon.Users /> {instructorName}
          </span>
        )}
      </div>

      <hr className={s.brassRule} />

      <div className={s.overviewBody}>
        {lesson?.content ? (
          <p style={{ whiteSpace: 'pre-wrap' }}>{lesson.content}</p>
        ) : (
          <p>
            Welcome to <strong>What is .NET? [Pt 1]</strong>. In this introductory lesson, you will explore the .NET framework,
            Common Language Runtime (CLR), C# basics, and how cross-platform applications are created with modern .NET.
          </p>
        )}
      </div>
    </div>
  );
}

function QATab({ lesson }) {
  return <LessonChat currentLesson={lesson} lessonId={lesson?.id} />;
}

function ResourcesTab({ resources = [] }) {
  if (resources.length > 0) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center select-none">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-10 h-10 text-gray-300 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v8.25A2.25 2.25 0 0 0 4.5 16.5h15a2.25 2.25 0 0 0 2.25-2.25V10.5a2.25 2.25 0 0 0-2.25-2.25h-9.69Z"
        />
      </svg>
      <p className="text-sm font-medium text-gray-500">
        No resources have been added to this lesson yet.
      </p>
      <p className="text-xs text-gray-400 mt-1.5 leading-relaxed max-w-[260px]">
        Check back later — the instructor may upload files, links, or references here.
      </p>
    </div>
  );
}

const TABS = [
  { id: 'overview',   label: 'Overview',       icon: <Icon.BookOpen /> },
  { id: 'qa',         label: 'Quick AI Q&A',   icon: <Icon.MessageCircle /> },
  { id: 'notes',      label: 'Notes',          icon: <Icon.PencilSquare /> },
  { id: 'resources',  label: 'Resources',      icon: <Icon.FileText /> },
];

function TabsArea({ activeLesson, instructorName, videoRef }) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className={s.tabsContainer}>
      <nav className={s.tabNav} role="tablist" aria-label="Lesson sections">
        {TABS.map(tab => (
          <button
            key={tab.id}
            id={`tab-btn-${tab.id}`}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            className={`${s.tabBtn} ${activeTab === tab.id ? s.tabBtnActive : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </nav>

      <div
        id={`tabpanel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`tab-btn-${activeTab}`}
        className={s.tabContent}
        key={activeTab}
      >
        {activeTab === 'overview'  && <OverviewTab lesson={activeLesson} instructorName={instructorName} />}
        {activeTab === 'qa'        && <QATab lesson={activeLesson} />}
        {activeTab === 'notes'     && <NotesTab />}
        {activeTab === 'resources' && <ResourcesTab resources={[]} />}
      </div>
    </div>
  );
}

function CourseSection({ section, activeLessonId, onSelectLesson, onToggleComplete, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen ?? true);
  const doneCount = section.lessons.filter(l => l.completed).length;
  const allDone   = doneCount === section.lessons.length && section.lessons.length > 0;

  return (
    <div className={s.courseSection}>
      <button
        id={`section-toggle-${section.id}`}
        className={s.sectionToggle}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls={`section-lessons-${section.id}`}
      >
        <span
          className={`${s.sectionChevron} ${open ? s.sectionChevronOpen : ''}`}
          aria-hidden="true"
        >
          <Icon.ChevronDown />
        </span>

        <span className={s.sectionMeta}>
          <span className={s.sectionName}>{section.title}</span>
          <span className={s.sectionStats}>
            {doneCount}/{section.lessons.length} lessons
          </span>
        </span>

        {allDone && (
          <span className={s.sectionDone} aria-label="Section complete">
            DONE
          </span>
        )}
      </button>

      <div
        id={`section-lessons-${section.id}`}
        className={`${s.lessonList} ${open ? s.lessonListOpen : ''}`}
        role="list"
      >
        {section.lessons.map(lesson => {
          const isActive = lesson.id === activeLessonId;
          return (
            <div
              key={lesson.id}
              id={`lesson-item-${lesson.id}`}
              role="listitem"
              className={`${s.lessonItem} ${isActive ? s.lessonItemActive : ''}`}
              onClick={() => onSelectLesson(lesson)}
              aria-current={isActive ? 'true' : undefined}
            >
              <label
                className={s.checkboxWrapper}
                onClick={e => e.stopPropagation()}
                title={lesson.completed ? "Mark as incomplete" : "Mark as completed"}
              >
                <input
                  type="checkbox"
                  id={`lesson-checkbox-${lesson.id}`}
                  className={s.hiddenCheckbox}
                  checked={Boolean(lesson.completed)}
                  onChange={e => onToggleComplete(lesson.id, e.target.checked)}
                />
                <span
                  className={`${s.lessonCheck} ${lesson.completed ? s.lessonCheckDone : ''} ${isActive && !lesson.completed ? s.lessonCheckActive : ''}`}
                  aria-hidden="true"
                >
                  {lesson.completed && <Icon.Check size={9} />}
                </span>
              </label>

              <div className={s.lessonInfo}>
                <span className={s.lessonTitle}>{lesson.title}</span>
                <span className={s.lessonDuration}>
                  <Icon.Clock /> {lesson.duration}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CourseSidebar({ sections, activeLessonId, onSelectLesson, onToggleComplete, progress }) {
  return (
    <aside className={s.sidebar} aria-label="Course content">
      <div className={s.sidebarHeader}>
        <p className={s.sidebarTitle}>Course Content</p>
        <div className={s.sidebarProgress}>
          <div
            className={s.sidebarProgressTrack}
            role="progressbar"
            aria-valuenow={progress.pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${progress.pct}% of course complete`}
          >
            <div
              className={s.sidebarProgressFill}
              style={{ width: `${progress.pct}%` }}
            />
          </div>
          <span className={s.sidebarProgressText}>
            {progress.done}/{progress.total}
          </span>
        </div>
      </div>

      <div className={s.sidebarScroll}>
        {sections.map((sec, idx) => (
          <CourseSection
            key={sec.id}
            section={sec}
            activeLessonId={activeLessonId}
            onSelectLesson={onSelectLesson}
            onToggleComplete={onToggleComplete}
            defaultOpen={idx === 0}
          />
        ))}
      </div>
    </aside>
  );
}

export default function LearningRoom() {
  const navigate = useNavigate();
  const { courseId } = useParams();

  const [course, setCourse] = useState(DEFAULT_COURSE);
  const [lessons, setLessons] = useState(DEFAULT_LESSONS);
  const [activeLesson, setActiveLesson] = useState(DEFAULT_LESSONS[0]);
  const [completionToast, setCompletionToast] = useState(null);

  const sharedVideoRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchCourseDetails() {
      try {
        const { data } = await api.get(`/api/Courses/GetById/${courseId}`);
        if (isMounted && data) {
          setCourse(prev => ({
            ...prev,
            title: data.title || DEFAULT_COURSE_TITLE,
            instructorName: data.instructorName || prev.instructorName,
          }));
        }
      } catch (err) {
        console.info('[LearningRoom] Demo presentation mode active');
      }
    }
    if (courseId) {
      fetchCourseDetails();
    }
    return () => { isMounted = false; };
  }, [courseId]);

  const handleToggleComplete = useCallback((lessonId, forcedCompleted) => {
    setLessons(prevLessons =>
      prevLessons.map(lesson => {
        if (lesson.id === lessonId) {
          const nextCompleted = typeof forcedCompleted === 'boolean' ? forcedCompleted : !lesson.completed;
          return { ...lesson, completed: nextCompleted };
        }
        return lesson;
      })
    );

    setActiveLesson(prev => {
      if (prev && prev.id === lessonId) {
        const nextCompleted = typeof forcedCompleted === 'boolean' ? forcedCompleted : !prev.completed;
        return { ...prev, completed: nextCompleted };
      }
      return prev;
    });

    const isDone = typeof forcedCompleted === 'boolean' ? forcedCompleted : true;
    if (isDone) {
      setCompletionToast({
        lessonTitle: activeLesson?.title || DEFAULT_LESSONS[0].title,
        nextLesson: null,
      });

      api.post(`/api/Progress/Complete/${lessonId}`).catch(() => {});
    } else {
      setCompletionToast(null);
    }
  }, [activeLesson]);

  const handleVideoEnd = useCallback(() => {
    if (!activeLesson) return;
    handleToggleComplete(activeLesson.id, true);
  }, [activeLesson, handleToggleComplete]);

  const handleSelectLesson = useCallback((lesson) => {
    setActiveLesson(lesson);
  }, []);

  const handleBack = useCallback(() => {
    navigate('/my-courses');
  }, [navigate]);

  const handleDismissToast = useCallback(() => {
    setCompletionToast(null);
  }, []);

  const completedLessons = lessons.filter(l => l.completed);
  const totalLessons = lessons;
  const progressPercent = totalLessons.length > 0
    ? Math.round((completedLessons.length / totalLessons.length) * 100)
    : 0;

  const progress = {
    done: completedLessons.length,
    total: totalLessons.length,
    pct: progressPercent,
  };

  const sections = buildSections(lessons);

  return (
    <div className={s.learningRoom}>
      <LearningHeader
        courseTitle={course.title}
        progress={progress}
        onBack={handleBack}
      />

      {completionToast && (
        <div
          className={s.completionToast}
          role="status"
          aria-live="polite"
          aria-label="Lesson completion notification"
        >
          <span className={s.completionToastIcon} aria-hidden="true">
            <Icon.Check size={14} />
          </span>
          <div className={s.completionToastBody}>
            <p className={s.completionToastTitle}>
              ✔ &nbsp;Lesson complete!
            </p>
            <p className={s.completionToastSub}>
              You've finished <strong>{completionToast.lessonTitle}</strong>! 🎉
            </p>
          </div>
          <button
            id="dismiss-completion-toast-btn"
            className={s.completionToastDismiss}
            onClick={handleDismissToast}
            aria-label="Dismiss notification"
          >
            ✕
          </button>
        </div>
      )}

      <div className={s.body}>
        <main className={s.mainCol} id="main-content" aria-label="Lesson content">
          <VideoPlayer
            lesson={activeLesson}
            onVideoEnd={handleVideoEnd}
            videoRef={sharedVideoRef}
          />
          <TabsArea
            activeLesson={activeLesson}
            instructorName={course.instructorName}
            videoRef={sharedVideoRef}
          />
        </main>

        <CourseSidebar
          sections={sections}
          activeLessonId={activeLesson?.id}
          onSelectLesson={handleSelectLesson}
          onToggleComplete={handleToggleComplete}
          progress={progress}
        />
      </div>
    </div>
  );
}
