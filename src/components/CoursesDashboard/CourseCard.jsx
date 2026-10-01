import React from "react";

const EditIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

const UserIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const AVATAR_GRADIENTS = [
  ["#6366f1", "#a855f7"],
  ["#0ea5e9", "#6366f1"],
  ["#f59e0b", "#ef4444"],
  ["#10b981", "#0ea5e9"],
  ["#ec4899", "#a855f7"],
  ["#f97316", "#f59e0b"],
];

function getGradient(id) {
  const idx = (typeof id === "number" ? id : String(id).charCodeAt(0) || 0) % AVATAR_GRADIENTS.length;
  const [from, to] = AVATAR_GRADIENTS[Math.abs(idx)];
  return `linear-gradient(135deg, ${from}, ${to})`;
}

function getInitials(title = "") {
  return title
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

const formatPrice = (value) => {
  const n = Number(value);
  if (Number.isNaN(n)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EGP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(n);
};

const ManageIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

export default function CourseCard({ course, onEdit, onDelete, onManage }) {
  const { id, title, instructorName, price } = course;

  return (
    <article className="edu-card">
      <div className="edu-card__top">
        <div
          className="edu-card__avatar"
          style={{ background: getGradient(id) }}
          aria-hidden="true"
        >
          {getInitials(title) || "?"}
        </div>

        <div className="edu-card__actions">
          <button
            id={`edit-course-${id}`}
            className="edu-card__icon-btn"
            onClick={() => onEdit(course)}
            aria-label={`Edit "${title}"`}
            title="Edit course"
          >
            <EditIcon />
          </button>
        </div>
      </div>

      <h3 className="edu-card__title">{title || "Untitled Course"}</h3>

      <div className="edu-card__meta">
        <span className="edu-card__instructor">
          <UserIcon />
          {instructorName || "No instructor"}
        </span>
        <span className="edu-card__price">{formatPrice(price)}</span>
      </div>

      <hr className="edu-card__divider" />

      <div className="edu-card__footer">
        <span className="edu-card__id-badge">ID #{id}</span>
        <div style={{ display: "flex", gap: "0.4rem" }}>
          <button
            id={`delete-card-btn-${id}`}
            onClick={() => onDelete(course)}
            style={{
              display: "flex", alignItems: "center", gap: "0.3rem",
              fontSize: "0.72rem", fontWeight: 600,
              color: "#dc2626", background: "transparent",
              border: "1.5px solid #fca5a5", borderRadius: "0.5rem",
              padding: "0.32rem 0.65rem", cursor: "pointer",
              transition: "all 0.15s",
            }}
            aria-label={`Delete "${title}"`}
          >
            <TrashIcon /> Delete
          </button>
          <button
            id={`manage-course-${id}`}
            onClick={() => onManage(course)}
            style={{
              display: "flex", alignItems: "center", gap: "0.35rem",
              fontSize: "0.72rem", fontWeight: 600,
              color: "#0f172a", background: "#f59e0b",
              border: "1.5px solid #f59e0b", borderRadius: "0.5rem",
              padding: "0.32rem 0.65rem", cursor: "pointer",
              transition: "background 0.15s",
            }}
            aria-label={`Manage lessons for "${title}"`}
          >
            <ManageIcon /> Manage
          </button>
        </div>
      </div>
    </article>
  );
}
