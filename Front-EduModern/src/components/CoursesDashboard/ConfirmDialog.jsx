import React, { useEffect, useRef } from "react";

const WarnIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

export default function ConfirmDialog({ course, onCancel, onConfirm, isDeleting }) {
  const cancelRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => cancelRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onCancel(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onCancel]);

  return (
    <div
      className="edu-modal-overlay"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-desc"
      onClick={(e) => { if (e.target === e.currentTarget && !isDeleting) onCancel(); }}
    >
      <div className="edu-confirm">
        <div className="edu-confirm__icon" aria-hidden="true">
          <WarnIcon />
        </div>

        <h3 id="confirm-title" className="edu-confirm__title">Delete Course?</h3>

        <p id="confirm-desc" className="edu-confirm__text">
          You are about to permanently delete{" "}
          <span className="edu-confirm__course-name">"{course?.title || "this course"}"</span>.
          This action cannot be undone.
        </p>

        <div className="edu-confirm__actions">
          <button
            id="confirm-cancel-btn"
            ref={cancelRef}
            type="button"
            className="edu-btn--ghost"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            id="confirm-delete-btn"
            type="button"
            className="edu-btn--danger"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting…" : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
