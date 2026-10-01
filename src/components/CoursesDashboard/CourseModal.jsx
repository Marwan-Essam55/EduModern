import React, { useState, useEffect, useRef } from "react";

const CloseIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const BookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);

const TagIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
    <line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
);

function validate(fields) {
  const errors = {};
  if (!fields.title.trim()) {
    errors.title = "Course title is required.";
  } else if (fields.title.trim().length < 3) {
    errors.title = "Title must be at least 3 characters.";
  }
  const priceNum = Number(fields.price);
  if (fields.price === "" || fields.price === null) {
    errors.price = "Price is required.";
  } else if (Number.isNaN(priceNum) || priceNum < 0) {
    errors.price = "Enter a valid non-negative price.";
  }
  return errors;
}

const BASE_URL = `${import.meta.env.VITE_API_URL || 'https://edumodern-api.runasp.net'}/api/Courses`;

export default function CourseModal({ mode, initialData, onClose, onSuccess, onNotify }) {
  const isEdit = mode === "edit";

  const [fields, setFields] = useState({
    title: initialData?.title ?? "",
    price: initialData?.price !== undefined ? String(initialData.price) : "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => titleRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(fields);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      let response;
      const payload = { title: fields.title.trim(), price: Number(fields.price) };

      const authHeader = { "Content-Type": "application/json", "Authorization": "Bearer " + localStorage.getItem("edu_token") };

      if (isEdit) {
        response = await fetch(`${BASE_URL}/Update/${initialData.id}`, {
          method: "PUT",
          headers: authHeader,
          body: JSON.stringify({ ...payload, id: initialData.id }),
        });
      } else {
        response = await fetch(`${BASE_URL}/AddCourse`, {
          method: "POST",
          headers: authHeader,
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        const msg = await response.text().catch(() => "Unknown error");
        throw new Error(msg || `Server responded with ${response.status}`);
      }

      let saved = null;
      const ct = response.headers.get("content-type") ?? "";
      if (ct.includes("application/json")) {
        saved = await response.json();
      }

      onSuccess(saved);
      onNotify(
        isEdit ? "Course updated successfully!" : "Course added successfully!",
        "success"
      );
      onClose();
    } catch (err) {
      onNotify(err.message || "Request failed. Check the API is running.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="edu-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="edu-modal">
        <div className="edu-modal__header">
          <div className="edu-modal__title-wrap">
            <h2 id="modal-title" className="edu-modal__title">
              {isEdit ? "Edit Course" : "Add New Course"}
            </h2>
            <p className="edu-modal__subtitle">
              {isEdit
                ? "Update the details for this course."
                : "Fill in the details to create a new course."}
            </p>
          </div>
          <button id="modal-close-btn" className="edu-modal__close" onClick={onClose} aria-label="Close modal">
            <CloseIcon />
          </button>
        </div>

        <form id="course-form" className="edu-form" onSubmit={handleSubmit} noValidate>
          <div className="edu-form__group">
            <label htmlFor="field-title" className="edu-form__label">
              <BookIcon />
              Course Title <span className="edu-form__required">*</span>
            </label>
            <input
              ref={titleRef}
              id="field-title"
              name="title"
              type="text"
              className={`edu-form__input${errors.title ? " edu-form__input--error" : ""}`}
              placeholder="e.g. React & Node.js Bootcamp"
              value={fields.title}
              onChange={handleChange}
              disabled={submitting}
              autoComplete="off"
            />
            {errors.title && <p className="edu-form__error-hint">⚠ {errors.title}</p>}
          </div>

          <div className="edu-form__group">
            <label htmlFor="field-price" className="edu-form__label">
              <TagIcon />
              Price (EGP) <span className="edu-form__required">*</span>
            </label>
            <input
              id="field-price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              className={`edu-form__input${errors.price ? " edu-form__input--error" : ""}`}
              placeholder="e.g. 799"
              value={fields.price}
              onChange={handleChange}
              disabled={submitting}
            />
            {errors.price
              ? <p className="edu-form__error-hint">⚠ {errors.price}</p>
              : <p className="edu-form__hint">Instructor name is assigned automatically by the system.</p>
            }
          </div>

          <div className="edu-form__actions">
            <button id="modal-cancel-btn" type="button" className="edu-btn--ghost" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button id="modal-submit-btn" type="submit" className="edu-btn--submit" disabled={submitting}>
              {submitting
                ? <><span className="edu-btn__spinner" /> Saving…</>
                : isEdit ? "Save Changes" : "Add Course"
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
