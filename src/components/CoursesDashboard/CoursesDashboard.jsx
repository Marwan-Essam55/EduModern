import React, { useState, useEffect, useCallback, useRef } from "react";
import "./CoursesDashboard.css";
import CourseCard  from "./CourseCard";
import CourseModal from "./CourseModal";

const BASE      = `${import.meta.env.VITE_API_URL || 'https://edumodern-api.runasp.net'}/api`;
const COURSES   = `${BASE}/Courses`;
const LESSONS   = `${BASE}/Lessons`;
const RESOURCES = `${BASE}/Resources`;

const authHeaders = () => ({
  "Authorization": "Bearer " + localStorage.getItem("edu_token"),
});
const jsonHeaders = () => ({
  "Content-Type": "application/json",
  "Authorization": "Bearer " + localStorage.getItem("edu_token"),
});

const PlusIcon    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const SearchIcon  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const RefreshIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>;
const AlertIcon   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
const BookOpenIcon= () => <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
const BackIcon    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const VideoIcon   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>;
const FileIcon    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
const CheckIcon   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>;
const LayersIcon  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>;

function Toast({ message, type, onDismiss }) {
  useEffect(() => { const t = setTimeout(onDismiss, 3800); return () => clearTimeout(t); }, [onDismiss]);
  return (
    <div className={`edu-toast edu-toast--${type}`} role="status" aria-live="polite">
      <span className="edu-toast__dot" aria-hidden="true" />
      {message}
    </div>
  );
}

function Spinner({ size = 18 }) {
  return (
    <span style={{
      display: "inline-block", width: size, height: size, flexShrink: 0,
      border: `2px solid rgba(255,255,255,0.25)`,
      borderTop: `2px solid #fff`,
      borderRadius: "50%",
      animation: "spin 0.7s linear infinite",
    }} aria-hidden="true" />
  );
}

function ManageCourseView({ course, courseLessons = [], onBack, onNotify }) {
  const [activeTab,   setActiveTab]   = useState("lessons");
  const [lessons,     setLessons]     = useState([]);
  const [lessonsLoad, setLessonsLoad] = useState(true);
  const [lessonsErr,  setLessonsErr]  = useState(null);

  const [lessonTitle,   setLessonTitle]   = useState("");
  const [lessonContent, setLessonContent] = useState("");
  const [lessonVideo,   setLessonVideo]   = useState(null);
  const [uploadingLesson, setUploadingLesson] = useState(false);
  const videoRef = useRef(null);

  const [resLessonId,  setResLessonId]  = useState("");
  const [resTitle,     setResTitle]     = useState("");
  const [resFile,      setResFile]      = useState(null);
  const [uploadingRes, setUploadingRes] = useState(false);
  const resFileRef = useRef(null);

  const fetchLessons = useCallback(async () => {
    setLessonsLoad(true);
    setLessonsErr(null);
    try {
      const res = await fetch(`${LESSONS}/Course/${course.id}`, { headers: authHeaders() });
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      const data = await res.json();
      setLessons(Array.isArray(data) ? data : []);
    } catch (err) {
      setLessonsErr(err.message || "Could not load lessons.");
    } finally {
      setLessonsLoad(false);
    }
  }, [course.id]);

  useEffect(() => { fetchLessons(); }, [fetchLessons]);

  async function handleLessonSubmit(e) {
    e.preventDefault();
    if (!lessonTitle.trim()) { onNotify("Lesson title is required.", "error"); return; }
    if (!lessonVideo)        { onNotify("Please select a video file.", "error"); return; }

    setUploadingLesson(true);
    try {
      const fd = new FormData();
      fd.append("CourseId",    course.id);
      fd.append("Title",       lessonTitle.trim());
      fd.append("Content",     lessonContent.trim());
      fd.append("VideoFile",   lessonVideo);

      const res = await fetch(`${LESSONS}/AddLesson`, {
        method: "POST",
        headers: authHeaders(),
        body: fd,
      });
      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || `Upload failed (${res.status})`);
      }
      onNotify("Lesson uploaded successfully!", "success");
      setLessonTitle(""); setLessonContent(""); setLessonVideo(null);
      if (videoRef.current) videoRef.current.value = "";
      fetchLessons();
    } catch (err) {
      onNotify(err.message || "Lesson upload failed.", "error");
    } finally {
      setUploadingLesson(false);
    }
  }

  const availableLessons = courseLessons.length > 0 ? courseLessons : lessons;

  async function handleResourceSubmit(e) {
    e.preventDefault();
    if (!resLessonId) { onNotify("Please select a lesson.", "error"); return; }
    if (!resTitle.trim()) { onNotify("Resource title is required.", "error"); return; }
    if (!resFile)     { onNotify("Please select a file.", "error"); return; }

    setUploadingRes(true);
    try {
      const fd = new FormData();
      fd.append("lessonId",     resLessonId);
      fd.append("title",        resTitle.trim());
      fd.append("file",         resFile);
      fd.append("LessonId",     resLessonId);
      fd.append("Title",        resTitle.trim());
      fd.append("ResourceFile", resFile);

      const res = await fetch(`${RESOURCES}/Upload`, {
        method: "POST",
        headers: authHeaders(),
        body: fd,
      });
      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || `Upload failed (${res.status})`);
      }
      onNotify("Resource uploaded successfully!", "success");
      setResLessonId(""); setResTitle(""); setResFile(null);
      if (resFileRef.current) resFileRef.current.value = "";
    } catch (err) {
      onNotify(err.message || "Resource upload failed.", "error");
    } finally {
      setUploadingRes(false);
    }
  }

  const inputStyle = {
    width: "100%", padding: "0.625rem 0.875rem",
    border: "1px solid #e2e8f0", borderRadius: "0.6rem",
    fontSize: "0.875rem", color: "#0f172a",
    background: "#fff", outline: "none",
    fontFamily: "inherit", boxSizing: "border-box",
    transition: "border-color 0.15s",
  };
  const labelStyle = {
    display: "block", fontSize: "0.72rem",
    fontWeight: 600, color: "#475569",
    textTransform: "uppercase", letterSpacing: "0.06em",
    marginBottom: "0.4rem",
  };
  const sectionCard = {
    background: "#fff", border: "1px solid #e2e8f0",
    borderRadius: "1rem", padding: "1.5rem",
    marginBottom: "1.25rem",
  };

  return (
    <div style={{ animation: "fadeSlideIn 0.3s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.75rem", flexWrap: "wrap" }}>
        <button
          id="back-to-courses-btn"
          onClick={onBack}
          style={{
            display: "flex", alignItems: "center", gap: "0.4rem",
            fontSize: "0.8rem", fontWeight: 600, color: "#64748b",
            background: "transparent", border: "1px solid #e2e8f0",
            borderRadius: "0.6rem", padding: "0.45rem 0.9rem",
            cursor: "pointer", transition: "all 0.15s",
          }}
        >
          <BackIcon /> Back to Courses
        </button>
        <div>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#f59e0b", marginBottom: "0.15rem" }}>
            Managing Course
          </p>
          <h2 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 700, color: "#fff", fontFamily: "'Playfair Display', Georgia, serif" }}>
            {course.title || "Untitled Course"}
          </h2>
        </div>
      </div>

      
           <div style={{
  display: "flex",
  gap: "0.5rem",
  background: "#f1f5f9",
  padding: "0.35rem",
  borderRadius: "0.75rem",
  marginBottom: "1.75rem",
  width: "fit-content",
  border: "1px solid #e2e8f0"
}}>
  {[{ id: "lessons", label: "Lessons", Icon: LayersIcon }, { id: "resources", label: "Resources", Icon: FileIcon }].map(({ id, label, Icon }) => (
    <button
      key={id}
      type="button"
      onClick={() => setActiveTab(id)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.45rem",
        padding: "0.55rem 1.25rem",
        borderRadius: "0.55rem",
        border: "none",
        cursor: "pointer",
        fontSize: "0.85rem",
        fontWeight: 600,
        transition: "all 0.15s ease",
        background: activeTab === id ? "#ffffff" : "transparent",
        color: activeTab === id ? "#0f172a" : "#64748b",
        boxShadow: activeTab === id ? "0 2px 6px rgba(0,0,0,0.05)" : "none",
      }}
    >
      <Icon />{label}
    </button>
  ))}
</div>

      {activeTab === "lessons" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", alignItems: "start" }}>

          <div style={sectionCard}>
            <h3 style={{ margin: "0 0 1rem", fontSize: "0.95rem", fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <LayersIcon /> Existing Lessons
              {!lessonsLoad && <span style={{ fontSize: "0.7rem", background: "#f1f5f9", color: "#64748b", borderRadius: "999px", padding: "0.1rem 0.55rem", fontWeight: 600 }}>{lessons.length}</span>}
            </h3>
            {lessonsLoad && <div style={{ display: "flex", justifyContent: "center", padding: "2rem 0" }}><Spinner size={24} /></div>}
            {lessonsErr  && <p style={{ color: "#ef4444", fontSize: "0.8rem" }}>{lessonsErr}</p>}
            {!lessonsLoad && !lessonsErr && lessons.length === 0 && (
              <p style={{ fontSize: "0.82rem", color: "#94a3b8", fontStyle: "italic" }}>No lessons yet. Add the first one on the right.</p>
            )}
            {!lessonsLoad && lessons.map((l, i) => (
              <div key={l.id ?? i} style={{
                display: "flex", alignItems: "flex-start", gap: "0.75rem",
                padding: "0.75rem", borderRadius: "0.6rem", marginBottom: "0.5rem",
                background: "#f8fafc", border: "1px solid #e2e8f0",
              }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", color: "#f59e0b", fontWeight: 700, fontSize: "0.75rem", flexShrink: 0 }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: "0.85rem", color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {l.title || "Untitled Lesson"}
                  </p>
                  {l.content && <p style={{ margin: "0.2rem 0 0", fontSize: "0.75rem", color: "#64748b" }} className="line-clamp-1">{l.content}</p>}
                </div>
                <span style={{ fontSize: "0.68rem", background: "#dbeafe", color: "#1d4ed8", borderRadius: "999px", padding: "0.15rem 0.5rem", fontWeight: 600, flexShrink: 0 }}>
                  #{l.id}
                </span>
              </div>
            ))}
          </div>

          

          <div style={sectionCard}>
            <h3 style={{ margin: "0 0 1.1rem", fontSize: "0.95rem", fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <VideoIcon /> Add New Lesson
            </h3>
            <form id="add-lesson-form" onSubmit={handleLessonSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
              <div>
                <label style={labelStyle} htmlFor="lesson-title">Lesson Title *</label>
                <input id="lesson-title" type="text" placeholder="e.g. Introduction to Variables"
                  value={lessonTitle} onChange={e => setLessonTitle(e.target.value)}
                  disabled={uploadingLesson} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle} htmlFor="lesson-content">Content / Summary</label>
                <textarea id="lesson-content" placeholder="Brief description of this lesson..."
                  value={lessonContent} onChange={e => setLessonContent(e.target.value)}
                  disabled={uploadingLesson}
                  rows={3}
                  style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }} />
              </div>
              <div>
                <label style={labelStyle} htmlFor="lesson-video">Video File *</label>
                <input id="lesson-video" type="file" accept="video/*" ref={videoRef}
                  onChange={e => setLessonVideo(e.target.files[0] || null)}
                  disabled={uploadingLesson}
                  style={{ ...inputStyle, padding: "0.45rem 0.875rem", cursor: "pointer" }} />
                {lessonVideo && (
                  <p style={{ fontSize: "0.72rem", color: "#10b981", marginTop: "0.3rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <CheckIcon /> {lessonVideo.name} ({(lessonVideo.size / 1024 / 1024).toFixed(1)} MB)
                  </p>
                )}
              </div>
              <button id="upload-lesson-btn" type="submit" disabled={uploadingLesson}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                  padding: "0.7rem 1.25rem", borderRadius: "0.65rem", border: "none",
                  background: uploadingLesson ? "#94a3b8" : "#0f172a", color: "#fff",
                  fontWeight: 700, fontSize: "0.85rem", cursor: uploadingLesson ? "not-allowed" : "pointer",
                  transition: "background 0.15s",
                }}>
                {uploadingLesson ? <><Spinner /> Uploading...</> : <><VideoIcon /> Upload Video &amp; Save Lesson</>}
              </button>
              {uploadingLesson && (
                <p style={{ fontSize: "0.75rem", color: "#64748b", textAlign: "center", fontStyle: "italic" }}>
                  Video upload in progress — this may take a moment...
                </p>
              )}
            </form>
          </div>
        </div>
      )}

      {activeTab === "resources" && (
        <div style={{ maxWidth: "600px" }}>
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "0.875rem",
              padding: "1.75rem",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
            }}
          >
            <h3
              style={{
                margin: "0 0 0.5rem",
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "#0f172a",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <FileIcon /> Upload New Resource
            </h3>
            <p style={{ margin: "0 0 1.25rem", fontSize: "0.825rem", color: "#64748b" }}>
              Attach slides, lecture notes, or supplementary materials to a lesson.
            </p>

            <form
              id="upload-resource-form"
              onSubmit={handleResourceSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}
            >
              <div>
                <label
                  htmlFor="res-lesson-select"
                  style={{
                    display: "block",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "#475569",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "0.4rem",
                  }}
                >
                  Lesson Selector *
                </label>
                {lessonsLoad ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0" }}>
                    <Spinner size={15} />
                    <span style={{ fontSize: "0.8rem", color: "#64748b" }}>Loading lessons…</span>
                  </div>
                ) : (
                  <select
                    id="res-lesson-select"
                    value={resLessonId}
                    onChange={(e) => setResLessonId(e.target.value)}
                    disabled={uploadingRes || availableLessons.length === 0}
                    style={{
                      width: "100%",
                      padding: "0.65rem 0.85rem",
                      fontSize: "0.875rem",
                      border: "1px solid #cbd5e1",
                      borderRadius: "0.5rem",
                      background: availableLessons.length === 0 ? "#f8fafc" : "#ffffff",
                      color: "#0f172a",
                      cursor: availableLessons.length === 0 ? "not-allowed" : "pointer",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  >
                    <option value="">-- Select a lesson --</option>
                    {availableLessons.map((l, i) => (
                      <option key={l.id ?? i} value={l.id}>
                        {l.title || `Lesson #${l.id ?? i + 1}`}
                      </option>
                    ))}
                  </select>
                )}
                {availableLessons.length === 0 && !lessonsLoad && (
                  <p style={{ margin: "0.4rem 0 0", fontSize: "0.75rem", color: "#ef4444" }}>
                    ⚠ No lessons found. Please add a lesson first in the Lessons tab.
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="res-title-input"
                  style={{
                    display: "block",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "#475569",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "0.4rem",
                  }}
                >
                  Resource Title *
                </label>
                <input
                  id="res-title-input"
                  type="text"
                  placeholder="e.g., Lecture Slides"
                  value={resTitle}
                  onChange={(e) => setResTitle(e.target.value)}
                  disabled={uploadingRes}
                  style={{
                    width: "100%",
                    padding: "0.65rem 0.85rem",
                    fontSize: "0.875rem",
                    border: "1px solid #cbd5e1",
                    borderRadius: "0.5rem",
                    background: "#ffffff",
                    color: "#0f172a",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="res-file-input"
                  style={{
                    display: "block",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "#475569",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "0.4rem",
                  }}
                >
                  File *
                </label>
                <input
                  id="res-file-input"
                  type="file"
                  ref={resFileRef}
                  onChange={(e) => setResFile(e.target.files[0] || null)}
                  disabled={uploadingRes}
                  style={{
                    width: "100%",
                    padding: "0.5rem 0.85rem",
                    fontSize: "0.875rem",
                    border: "1px solid #cbd5e1",
                    borderRadius: "0.5rem",
                    background: "#ffffff",
                    color: "#0f172a",
                    cursor: "pointer",
                    boxSizing: "border-box",
                  }}
                />
                {resFile && (
                  <p style={{ margin: "0.35rem 0 0", fontSize: "0.75rem", color: "#10b981", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <CheckIcon /> {resFile.name}&nbsp;
                    <span style={{ color: "#64748b" }}>({(resFile.size / 1024).toFixed(0)} KB)</span>
                  </p>
                )}
              </div>

              <button
                id="upload-resource-btn"
                type="submit"
                disabled={uploadingRes || availableLessons.length === 0}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  marginTop: "0.5rem",
                  padding: "0.75rem 1.25rem",
                  borderRadius: "0.55rem",
                  border: "none",
                  background: (uploadingRes || availableLessons.length === 0) ? "#94a3b8" : "#0f172a",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  cursor: (uploadingRes || availableLessons.length === 0) ? "not-allowed" : "pointer",
                  transition: "background 0.15s ease",
                }}
              >
                {uploadingRes ? (
                  <>
                    <Spinner size={16} />
                    <span>Uploading Resource...</span>
                  </>
                ) : (
                  <>
                    <FileIcon />
                    <span>Upload Resource</span>
                  </>
                )}
              </button>

              {uploadingRes && (
                <p style={{ fontSize: "0.73rem", color: "#64748b", textAlign: "center", fontStyle: "italic", margin: 0 }}>
                  Uploading file to server — please wait…
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CoursesDashboard() {
  const [courses,      setCourses]      = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [search,       setSearch]       = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseLessons, setCourseLessons] = useState([]);

  const [modalMode,    setModalMode]    = useState(null);
  const [editTarget,   setEditTarget]   = useState(null);

  const [toast, setToast]   = useState(null);
  const toastKey = useRef(0);

  const fetchCourses = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${COURSES}/GetAll`, { headers: authHeaders() });
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      const data = await res.json();
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err instanceof TypeError
          ? `Cannot reach the API. Make sure the backend is reachable at ${import.meta.env.VITE_API_URL || 'https://edumodern-api.runasp.net'}.`
          : err.message || "Unexpected error fetching courses."
      );
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  useEffect(() => {
    if (!selectedCourse) {
      setCourseLessons([]);
      return;
    }
    const token = localStorage.getItem("edu_token");
    fetch(`${LESSONS}/Course/${selectedCourse.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch lessons");
        return res.json();
      })
      .then((data) => {
        setCourseLessons(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error fetching course lessons:", err);
        setCourseLessons([]);
      });
  }, [selectedCourse]);

  const handleDeleteCard = useCallback(async (course) => {
    if (!window.confirm(`Are you sure you want to delete "${course.title || 'this course'}"?`)) return;
    try {
      const res = await fetch(`${COURSES}/Delete/${course.id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error(`Delete failed (${res.status})`);
      setCourses(prev => prev.filter(c => c.id !== course.id));
      notify("Course deleted successfully.", "success");
    } catch (err) {
      notify(err.message || "Failed to delete course.", "error");
    }
  }, []);

  const openAdd  = () => { setEditTarget(null); setModalMode("add"); };
  const openEdit = (c) => { setEditTarget(c); setModalMode("edit"); };
  const closeModal = () => { setModalMode(null); setEditTarget(null); };
  const handleModalSuccess = () => fetchCourses();

  function notify(message, type = "success") {
    toastKey.current += 1;
    setToast({ message, type, key: toastKey.current });
  }

  const filtered = courses.filter(c => {
    const q = search.toLowerCase();
    return (c.title ?? "").toLowerCase().includes(q) || (c.instructorName ?? "").toLowerCase().includes(q);
  });

  return (
    <div className="edu-dash">
      <div className="edu-dash__glow edu-dash__glow--a" aria-hidden="true" />
      <div className="edu-dash__glow edu-dash__glow--b" aria-hidden="true" />

      <nav className="edu-dash__nav" aria-label="Main navigation">
        <div className="edu-dash__brand">
          <span className="edu-dash__brand-name">Edu<span>Modern</span></span>
        </div>
        <div className="edu-dash__nav-right">
          <span className="edu-dash__nav-badge">
            {selectedCourse ? "Course Manager" : "Instructor Panel"}
          </span>
        </div>
      </nav>

      <main className="edu-dash__content">

        {selectedCourse ? (
          <ManageCourseView
            course={selectedCourse}
            courseLessons={courseLessons}
            onBack={() => {
              setSelectedCourse(null);
              setCourseLessons([]);
            }}
            onNotify={notify}
          />
        ) : (
          <>

            <div className="edu-dash__page-header">
              <div>
                <h1 className="edu-dash__page-heading">
                  <span>Courses</span> Dashboard
                </h1>
                <p className="edu-dash__page-sub">
                  Add and manage your course catalog. Click <strong>Manage</strong> on a card to add lessons and resources.
                </p>
              </div>
              {!loading && !error && (
                <div className="edu-dash__stats" aria-label="Course statistics">
                  <div className="edu-dash__stat">
                    <span className="edu-dash__stat-value">{courses.length}</span>
                    <span className="edu-dash__stat-label">Total Courses</span>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="edu-dash__error-banner" role="alert">
                <span className="edu-dash__error-icon"><AlertIcon /></span>
                <div className="edu-dash__error-text">
                  <p className="edu-dash__error-title">Could not load courses</p>
                  <p className="edu-dash__error-msg">{error}</p>
                </div>
                <button id="retry-btn" className="edu-btn--ghost" onClick={fetchCourses}><RefreshIcon /> Retry</button>
              </div>
            )}

            {!loading && (
              <div className="edu-dash__toolbar">
                <div className="edu-dash__search-wrap">
                  <span className="edu-dash__search-icon"><SearchIcon /></span>
                  <input id="course-search" type="search" className="edu-dash__search"
                    placeholder="Search courses or instructors..." value={search}
                    onChange={e => setSearch(e.target.value)} aria-label="Search courses" />
                </div>
                <div style={{ display: "flex", gap: "0.6rem" }}>
                  <button id="refresh-btn" className="edu-btn--ghost" onClick={fetchCourses}><RefreshIcon /> Refresh</button>
                  <button id="add-course-btn" className="edu-btn--primary" onClick={openAdd}><PlusIcon /> Add Course</button>
                </div>
              </div>
            )}

            {loading && (
              <div className="edu-dash__state" aria-live="polite">
                <div className="edu-dash__spinner" aria-label="Loading courses" />
                <p className="edu-dash__state-title">Loading courses...</p>
                <p className="edu-dash__state-text">Connecting to the API.</p>
              </div>
            )}

            {!loading && !error && filtered.length === 0 && (
              <div className="edu-dash__state">
                <div className="edu-dash__empty-icon" aria-hidden="true"><BookOpenIcon /></div>
                <p className="edu-dash__state-title">{search ? "No matching courses" : "No courses yet"}</p>
                <p className="edu-dash__state-text">
                  {search ? `No courses match "${search}".` : "Click \"Add Course\" to create your first course."}
                </p>
                {!search && (
                  <button id="add-first-course-btn" className="edu-btn--primary" onClick={openAdd} style={{ marginTop: "0.5rem" }}>
                    <PlusIcon /> Add First Course
                  </button>
                )}
              </div>
            )}

            {!loading && !error && filtered.length > 0 && (
              <section className="edu-dash__grid" aria-label={`${filtered.length} course${filtered.length !== 1 ? "s" : ""}`}>
                {filtered.map((course, i) => (
                  <CourseCard
                    key={course.id ?? i}
                    course={course}
                    onEdit={openEdit}
                    onDelete={handleDeleteCard}
                    onManage={setSelectedCourse}
                    style={{ animationDelay: `${i * 40}ms` }}
                  />
                ))}
              </section>
            )}
          </>
        )}
      </main>

      {modalMode && (
        <CourseModal mode={modalMode} initialData={editTarget} onClose={closeModal} onSuccess={handleModalSuccess} onNotify={notify} />
      )}
      {toast && (
        <Toast key={toast.key} message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />
      )}
    </div>
  );
}
