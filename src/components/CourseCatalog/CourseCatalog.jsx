
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/api";
import Navbar from "../Navbar";

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');`;

const Icon = {
  Search: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Tag: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
      <line x1="7" y1="7" x2="7.01" y2="7"/>
    </svg>
  ),
  BookOpen: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  ),
  Play: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
  ),
  LogOut: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  X: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  CreditCard: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
      <line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  ),
  Phone: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.23h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.83a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  ),
  Sparkle: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
      <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09l2.846.813-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>
    </svg>
  ),
  Alert: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
};

const FALLBACK_PUBLIC_COURSES = [
  {
    id: 1,
    title: "Enterprise .NET Core & Microservices",
    description: "Master enterprise-scale backend development with .NET 8, Clean Architecture, CQRS, and Docker.",
    price: 899,
    category: "Backend Development",
    instructorName: "Dr. Sarah Mitchell",
  },
  {
    id: 2,
    title: "Full-Stack React 19 & Next.js Masterclass",
    description: "Build lightning-fast React applications with Server Components, Actions, and Tailwind CSS.",
    price: 799,
    category: "Frontend Engineering",
    instructorName: "Prof. Alex Rivera",
  },
  {
    id: 3,
    title: "Cloud DevOps with Kubernetes & Azure",
    description: "Continuous integration, GitOps pipelines with GitHub Actions, Helm charts, and container orchestration.",
    price: 949,
    category: "Cloud & DevOps",
    instructorName: "David Zhang, M.Sc.",
  },
  {
    id: 4,
    title: "Applied AI & Neural Networks with Python",
    description: "Build predictive AI models, LLM agents, and deploy PyTorch deep learning systems in production.",
    price: 1199,
    category: "Artificial Intelligence",
    instructorName: "Dr. Elena Rostova",
  },
  {
    id: 5,
    title: "Cybersecurity & Ethical Hacking Essentials",
    description: "Hands-on network defense, penetration testing methodologies, OWASP security, and zero trust architectures.",
    price: 699,
    category: "Security & Networks",
    instructorName: "Marcus Vance, CISSP",
  },
  {
    id: 6,
    title: "UI/UX Design Systems for Enterprise Apps",
    description: "Design accessible design systems, user journeys, micro-interactions, and Figma component libraries.",
    price: 599,
    category: "Product Design",
    instructorName: "Claire Dubois",
  },
];

function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 animate-pulse">
      <div className="h-2.5 w-20 bg-gray-200 rounded-full" />
      <div className="h-5 w-3/4 bg-gray-200 rounded-md" />
      <div className="h-4 w-1/2 bg-gray-100 rounded-md" />
      <div className="h-4 w-1/3 bg-gray-100 rounded-md" />
      <div className="h-10 bg-gray-100 rounded-xl mt-2" />
    </div>
  );
}

function BrowseCard({ course, onEnroll, isEnrolled, isEnrolling, animIndex }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), animIndex * 60);
    return () => clearTimeout(t);
  }, [animIndex]);

  const price = course.price ?? course.Price ?? null;
  const courseId = course.id ?? course.Id ?? course.courseId;

  return (
    <article
      className="group bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-4 hover:border-amber-300 hover:shadow-md hover:-translate-y-1 transition-all duration-300 ease-out"
      style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: "opacity 0.45s ease, transform 0.45s ease" }}
      aria-labelledby={`browse-course-${courseId}`}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-widest bg-amber-50 text-amber-700 border border-amber-100 rounded-full px-2.5 py-0.5">
          {course.category || course.Category || "Course"}
        </span>
        <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 bg-slate-50 border border-slate-100 rounded-full px-2 py-0.5">
          <Icon.Sparkle />AI Enabled
        </span>
      </div>
      <div className="flex-1">
        <h3 id={`browse-course-${courseId}`}
          className="text-base font-semibold text-[#0f172a] leading-snug mb-1 group-hover:text-amber-700 transition-colors duration-200"
          style={{ fontFamily: "'Playfair Display', serif" }}>
          {course.title || course.Title || course.name || "Untitled Course"}
        </h3>
        {(course.description || course.Description) && (
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mt-1">
            {course.description || course.Description}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-1.5 text-xs text-slate-500">
        <span className="flex items-center gap-1.5"><Icon.User />
          {course.instructorName || course.instructor || course.InstructorName || "EduModern Team"}
        </span>
        {price !== null && price !== undefined && (
          <span className="flex items-center gap-1.5"><Icon.Tag />
            <span className="font-semibold text-[#0f172a]">EGP {Number(price).toLocaleString()}</span>
          </span>
        )}
      </div>
      {isEnrolled ? (
        <div className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold">
          <Icon.Check />Enrolled
        </div>
      ) : (
        <button
          id={`enroll-btn-${courseId}`}
          type="button"
          onClick={() => onEnroll(courseId)}
          disabled={isEnrolling}
          className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-[#0f172a] bg-amber-500 hover:bg-amber-400 disabled:opacity-75 disabled:cursor-not-allowed py-2.5 rounded-xl transition-all duration-200 active:scale-[0.97]"
        >
          {isEnrolling ? (
            <>
              <span className="w-4 h-4 rounded-full border-2 border-[#0f172a]/30 border-t-[#0f172a] animate-spin" />
              <span>Enrolling...</span>
            </>
          ) : (
            <span>Enroll Now</span>
          )}
        </button>
      )}
    </article>
  );
}

function MyCourseCard({ course, onStartLearning, animIndex }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), animIndex * 60);
    return () => clearTimeout(t);
  }, [animIndex]);

  const courseId = course.id ?? course.Id ?? course.courseId;
  const progress = course.progress ?? course.Progress ?? course._progress ?? 0;

  return (
    <article
      className="group bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-4 hover:border-blue-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300 ease-out"
      style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: "opacity 0.45s ease, transform 0.45s ease" }}
      aria-labelledby={`my-course-${courseId}`}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-widest bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-2.5 py-0.5">
          {course.category || course.Category || "Enrolled"}
        </span>
        <span className="inline-flex items-center gap-1 text-[10px] text-amber-600 bg-amber-50 border border-amber-100 rounded-full px-2 py-0.5">
          <Icon.Sparkle />AI Enabled
        </span>
      </div>
      <div className="flex-1">
        <h3 id={`my-course-${courseId}`}
          className="text-base font-semibold text-[#0f172a] leading-snug mb-1 group-hover:text-blue-700 transition-colors duration-200"
          style={{ fontFamily: "'Playfair Display', serif" }}>
          {course.title || course.Title || course.name || "Untitled Course"}
        </h3>
        {(course.description || course.Description) && (
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mt-1">
            {course.description || course.Description}
          </p>
        )}
      </div>
      <div className="text-xs text-slate-500 flex items-center gap-1.5">
        <Icon.User />{course.instructorName || course.instructor || course.InstructorName || "EduModern Team"}
      </div>
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Progress</span>
          <span className="text-[10px] font-semibold text-[#0f172a]">{progress}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-1.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-700" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <button
        id={`start-learning-btn-${courseId}`}
        type="button"
        onClick={() => onStartLearning(courseId)}
        className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-white bg-[#0f172a] hover:bg-[#1e293b] border border-transparent hover:border-amber-400 py-2.5 rounded-xl transition-all duration-200 active:scale-[0.97]"
      >
        <Icon.Play />Start Learning
      </button>
    </article>
  );
}

function PaymentModal({ course, onClose, onSuccess }) {
  const [method, setMethod]       = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName]   = useState("");
  const [expiry, setExpiry]       = useState("");
  const [cvv, setCvv]             = useState("");
  const [phone, setPhone]         = useState("");
  const [paying, setPaying]       = useState(false);

  const handlePay = async () => {
    setPaying(true);
    await new Promise((r) => setTimeout(r, 1500));
    setPaying(false);
    onSuccess(course);
  };
  const handleBackdrop = (e) => { if (e.target === e.currentTarget) onClose(); };
  const price = course?.price ?? course?.Price ?? 0;
  const title = course?.title || course?.Title || course?.name || "Course";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
      onClick={handleBackdrop} role="dialog" aria-modal="true" aria-label="Payment modal">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-fadeSlideIn"
        onClick={(e) => e.stopPropagation()}>
        <div className="bg-[#0f172a] px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-400 mb-0.5">Secure Checkout</p>
            <h2 className="text-white text-lg font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Complete Your Enrollment</h2>
          </div>
          <button id="modal-close-btn" onClick={onClose} className="text-slate-400 hover:text-white transition-colors duration-150 p-1"><Icon.X /></button>
        </div>
        <div className="px-6 py-4 border-b border-gray-100 bg-amber-50">
          <p className="text-xs text-slate-500 mb-0.5">Enrolling in</p>
          <p className="text-sm font-semibold text-[#0f172a]" style={{ fontFamily: "'Playfair Display', serif" }}>{title}</p>
          <p className="text-lg font-bold text-amber-600 mt-1">EGP {Number(price).toLocaleString()}</p>
        </div>
        <div className="px-6 py-5 space-y-5">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Payment Method</p>
            <div className="grid grid-cols-2 gap-3">
              {[{ id: "card", label: "Credit / Debit Card", Ico: Icon.CreditCard }, { id: "vodafone", label: "Vodafone Cash", Ico: Icon.Phone }].map(({ id, label, Ico }) => (
                <button key={id} type="button" id={`payment-method-${id}`} onClick={() => setMethod(id)}
                  className={`flex flex-col items-center gap-2 p-3.5 rounded-xl border-2 text-center transition-all duration-150 text-xs font-medium ${method === id ? "border-amber-500 bg-amber-50 text-amber-700" : "border-gray-200 bg-white text-slate-500 hover:border-gray-300"}`}>
                  <Ico />{label}
                </button>
              ))}
            </div>
          </div>
          {method === "card" ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5" htmlFor="modal-card-number">Card Number</label>
                <input id="modal-card-number" type="text" inputMode="numeric" maxLength={19} placeholder="1234  5678  9012  3456" value={cardNumber}
                  onChange={(e) => { const v = e.target.value.replace(/\D/g,"").slice(0,16); setCardNumber(v.replace(/(.{4})/g,"$1  ").trim()); }}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 text-[#0f172a] placeholder-slate-300 transition-colors duration-150" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5" htmlFor="modal-card-name">Cardholder Name</label>
                <input id="modal-card-name" type="text" placeholder="Full name as on card" value={cardName} onChange={(e) => setCardName(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 text-[#0f172a] placeholder-slate-300 transition-colors duration-150" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5" htmlFor="modal-expiry">Expiry Date</label>
                  <input id="modal-expiry" type="text" placeholder="MM / YY" maxLength={7} value={expiry}
                    onChange={(e) => { const v = e.target.value.replace(/\D/g,"").slice(0,4); setExpiry(v.length > 2 ? `${v.slice(0,2)} / ${v.slice(2)}` : v); }}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 text-[#0f172a] placeholder-slate-300 transition-colors duration-150" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5" htmlFor="modal-cvv">CVV</label>
                  <input id="modal-cvv" type="password" placeholder="***" maxLength={4} value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g,"").slice(0,4))}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 text-[#0f172a] placeholder-slate-300 transition-colors duration-150" />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white flex-shrink-0"><Icon.Phone /></div>
                <div>
                  <p className="text-xs font-semibold text-slate-700">Vodafone Cash</p>
                  <p className="text-[10px] text-slate-500">Send to: 010 XXXX XXXX</p>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5" htmlFor="modal-phone">Your Vodafone Number</label>
                <input id="modal-phone" type="tel" placeholder="01X XXXX XXXX" value={phone} onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 text-[#0f172a] placeholder-slate-300 transition-colors duration-150" />
              </div>
            </div>
          )}
        </div>
        <div className="px-6 pb-6">
          <button id="pay-enroll-btn" type="button" onClick={handlePay} disabled={paying}
            className="w-full flex items-center justify-center gap-2 text-sm font-bold text-[#0f172a] bg-amber-500 hover:bg-amber-400 disabled:opacity-60 disabled:cursor-not-allowed py-3 rounded-xl transition-all duration-200 active:scale-[0.98]">
            {paying ? (
              <><span className="w-4 h-4 rounded-full border-2 border-[#0f172a]/30 border-t-[#0f172a] animate-spin" />Processing Payment...</>
            ) : (
              <><Icon.CreditCard />Pay &amp; Enroll - EGP {Number(price).toLocaleString()}</>
            )}
          </button>
          <p className="text-center text-[10px] text-slate-400 mt-3">This is a simulated payment. No real charge will occur.</p>
        </div>
      </div>
    </div>
  );
}

function Toast({ message, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3500); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-[#0f172a] text-white text-sm font-medium px-5 py-3.5 rounded-2xl shadow-xl animate-fadeSlideIn border border-slate-700">
      <span className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 text-white"><Icon.Check /></span>
      {message}
    </div>
  );
}

function EmptyState({ title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center px-6">
      <div className="w-14 h-14 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500"><Icon.BookOpen /></div>
      <div>
        <p className="text-base font-semibold text-slate-700 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>{title}</p>
        <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">{subtitle}</p>
      </div>
    </div>
  );
}

export default function CourseCatalog() {
  const navigate         = useNavigate();
  const { user, logout } = useAuth();

  const [allCourses,        setAllCourses]        = useState([]);
  const [myCourses,         setMyCourses]         = useState([]);
  const [loading,           setLoading]           = useState(true);
  const [error,             setError]             = useState(null);
  const [search,            setSearch]            = useState("");
  const [enrollingCourseId, setEnrollingCourseId] = useState(null);
  const [toast,             setToast]             = useState(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/api/Courses/GetAll");
      if (Array.isArray(data) && data.length > 0) {
        setAllCourses(data);
      } else {
        setAllCourses(FALLBACK_PUBLIC_COURSES);
      }
    } catch (err) {
      console.warn("Could not load courses from API; using catalog sample courses:", err?.message || err);
      setAllCourses(FALLBACK_PUBLIC_COURSES);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyCourses = useCallback(async () => {
    const token = localStorage.getItem("edu_token") || localStorage.getItem("token");
    if (!token) {
      setMyCourses([]);
      return;
    }
    try {
      const headers = { Authorization: `Bearer ${token}` };
      let response;
      try {
        response = await api.get("/api/Courses/GetMyCourses", { headers });
      } catch (err) {
        response = await api.get("/api/Courses/MyCourses", { headers });
      }
      if (response && response.data) {
        setMyCourses(Array.isArray(response.data) ? response.data : []);
      }
    } catch (err) {
      console.warn("Could not fetch enrolled courses:", err?.message || err);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
    fetchMyCourses();
  }, [fetchCourses, fetchMyCourses]);

  const handleEnroll = async (courseId) => {
    if (!courseId) return;
    const token = localStorage.getItem("edu_token") || localStorage.getItem("token");
    if (!token) {
      navigate("/login", { state: { from: { pathname: "/courses" } } });
      return;
    }

    setEnrollingCourseId(courseId);
    try {
      await api.post(
        `/api/Courses/Enroll/${courseId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const targetCourse = allCourses.find((c) => (c.id ?? c.Id ?? c.courseId) === courseId);
      const title = targetCourse?.title || targetCourse?.Title || targetCourse?.name || "the course";
      setToast(`Successfully enrolled in "${title}"!`);
      await fetchMyCourses();
    } catch (err) {
      const errMsg = (err?.message || err?.response?.data?.message || err?.response?.data || "").toString();
      const lower = errMsg.toLowerCase();
      if (lower.includes("already enrolled") || lower.includes("already")) {
        const targetCourse = allCourses.find((c) => (c.id ?? c.Id ?? c.courseId) === courseId);
        const title = targetCourse?.title || targetCourse?.Title || targetCourse?.name || "this course";
        setToast(`You are already enrolled in "${title}"!`);
        await fetchMyCourses();
      } else {
        setToast(errMsg || "Enrollment failed. Please try again.");
      }
    } finally {
      setEnrollingCourseId(null);
    }
  };

  const handleStartLearning = useCallback((courseId) => {
    const token = localStorage.getItem("edu_token") || localStorage.getItem("token");
    if (!token) {
      navigate("/login", { state: { from: { pathname: `/learn/${courseId}` } } });
      return;
    }
    navigate(`/learn/${courseId}`);
  }, [navigate]);

  const handleLogout = useCallback(() => {
    logout();
    navigate("/home", { replace: true });
  }, [logout, navigate]);

  const enrolledIds = new Set(
    myCourses.map((c) => c.id ?? c.Id ?? c.courseId).filter(Boolean)
  );

  const filterFn = (arr) => {
    if (!search.trim()) return arr;
    const q = search.toLowerCase();
    return arr.filter((c) =>
      [c.title, c.Title, c.name, c.instructorName, c.InstructorName, c.instructor, c.description, c.Description, c.category, c.Category]
        .filter(Boolean).some((f) => f.toLowerCase().includes(q))
    );
  };

  const filteredAll = filterFn(allCourses);
  const filteredMy  = filterFn(myCourses);
  const hasUser = Boolean(user || localStorage.getItem("edu_token") || localStorage.getItem("token"));
  const greeting = user?.name ? `Welcome back, ${user.name.split(" ")[0]}.` : "Course Catalog";
  const portalTag = hasUser ? "Student Portal" : "Course Catalog";
  const portalSubtitle = hasUser
    ? "Browse the course library, enroll in what excites you, and jump straight into your AI-powered lessons."
    : "Explore available public courses, inspect curriculum details, and kickstart your modern learning journey.";

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: FONT_IMPORT }} />
      <div className="min-h-screen bg-[#fdfbf7]" style={{ fontFamily: "'Inter', sans-serif" }}>
        <Navbar user={user} onLogout={handleLogout} />

        <div className="bg-[#0f172a] border-b border-slate-700/50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-500 mb-1.5">{portalTag}</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{greeting}</h1>
            <p className="text-sm text-slate-400 max-w-md">{portalSubtitle}</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-6 pb-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 flex-wrap">
            <p className="text-xs text-slate-400">
              {loading ? "Loading courses..." : `${filteredAll.length} course${filteredAll.length !== 1 ? "s" : ""} available`}
            </p>
            <div className="relative w-full sm:max-w-xs">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><Icon.Search /></span>
              <input id="course-search" type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search courses..."
                className="w-full pl-9 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 bg-white border border-gray-200 rounded-xl outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-colors duration-150" />
            </div>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-6 lg:px-8 py-6 pb-24">
          {error && !loading && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-5 py-4 mb-6 text-red-600">
              <Icon.Alert />
              <div>
                <p className="text-sm font-semibold">Could not load courses</p>
                <p className="text-xs text-red-500 mt-0.5">{error}</p>
              </div>
              <button onClick={fetchCourses} className="ml-auto text-xs font-semibold text-red-700 bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded-lg transition-colors duration-150">Retry</button>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filteredAll.length === 0 ? (
            <EmptyState title="No courses found" subtitle={search ? "No courses match your search. Try a different keyword." : "The course library is currently empty."} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredAll.map((course, i) => {
                const cId = course.id ?? course.Id ?? course.courseId;
                return (
                  <BrowseCard
                    key={cId ?? i}
                    course={course}
                    onEnroll={handleEnroll}
                    isEnrolled={enrolledIds.has(cId)}
                    isEnrolling={enrollingCourseId === cId}
                    animIndex={i}
                  />
                );
              })}
            </div>
          )}
        </main>

        <footer className="bg-[#0f172a] border-t border-slate-700/40 py-5 px-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-amber-500 flex items-center justify-center">
                <span className="text-[#0f172a] font-bold text-[10px]">E</span>
              </div>
              <span className="text-slate-500">EduModern</span>
            </div>
            <p>Copyright {new Date().getFullYear()} EduModern. All rights reserved.</p>
          </div>
        </footer>
      </div>

      {toast && (
        <Toast message={toast} onDone={() => setToast(null)} />
      )}
    </>
  );
}
