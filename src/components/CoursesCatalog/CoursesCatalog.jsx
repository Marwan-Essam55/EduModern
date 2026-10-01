import React, { useState, useEffect } from "react";
import "./CoursesCatalog.css";

export default function CoursesCatalog() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    setIsLoading(true);
    setError(null);
    try {
      const apiBase = import.meta.env.VITE_API_URL || 'https://edumodern-api.runasp.net';
      const response = await fetch(`${apiBase}/api/Courses/GetAll`);

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err instanceof TypeError
          ? "Unable to reach the server. Please confirm the .NET API is running."
          : err.message || "Something went wrong while loading courses."
      );
    } finally {
      setIsLoading(false);
    }
  }

  const formatPrice = (value) => {
    const number = Number(value);
    if (Number.isNaN(number)) return "—";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EGP",
      minimumFractionDigits: 2,
    }).format(number);
  };

  return (
    <div className="cc-root">
      <header className="cc-header">
        <div className="cc-mark">
          <div className="cc-mark-glyph">A</div>
          <span className="cc-mark-name">Trivex Software Academy</span>
        </div>
        <h1 className="cc-title">Courses Catalog</h1>
        <p className="cc-subtitle">
          قائمة الكورسات المتاحة حالياً، تشمل أسماء المحاضرين وتكلفة كل كورس.
        </p>
      </header>

      <main className="cc-body">
        <div className="cc-meta-row">
          <span className="cc-meta-label">All Courses</span>
          {!isLoading && !error && (
            <span className="cc-meta-count">
              {courses.length} {courses.length === 1 ? "course" : "courses"} listed
            </span>
          )}
        </div>

        {isLoading && (
          <div className="cc-state">
            <div className="cc-spinner" />
            <p className="cc-state-text">Loading courses…</p>
          </div>
        )}

        {!isLoading && error && (
          <div className="cc-error">
            <h2 className="cc-error-title">Courses could not be loaded</h2>
            <p className="cc-error-text">{error}</p>
            <button className="cc-retry-btn" onClick={fetchCourses}>
              Try again
            </button>
          </div>
        )}

        {!isLoading && !error && courses.length === 0 && (
          <div className="cc-state">
            <p className="cc-state-text">No courses have been added yet.</p>
          </div>
        )}

        {!isLoading && !error && courses.length > 0 && (
          <div className="cc-table-wrap">
            <table className="cc-table">
              <thead>
                <tr>
                  <th>Course Title</th>
                  <th>Instructor</th>
                  <th className="cc-col-price">Price</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course, index) => (
                  <tr key={course.id ?? course.Id ?? index}>
                    <td>
                      <div className="cc-course-title">
                        {course.title ?? course.Title}
                      </div>
                    </td>
                    <td>
                      <span className="cc-instructor">
                        {course.instructorName ?? course.InstructorName}
                      </span>
                    </td>
                    <td className="cc-price">
                      {formatPrice(course.price ?? course.Price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}