
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

const FONT_IMPORT = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap');
`;

const Icon = {
  MessageCircle: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      className="w-6 h-6">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  PenSquare: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      className="w-6 h-6">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  FolderOpen: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      className="w-6 h-6">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  Sparkle: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09l2.846.813-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>
    </svg>
  ),
  ArrowRight: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className="w-4 h-4">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      className="w-3.5 h-3.5">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  BookOpen: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      className="w-6 h-6">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  ),
};

function HeroSection() {
  return (
    <section id="hero" className="bg-[#fdfbf7] relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg,transparent,transparent 2px,#92400e 2px,#92400e 3px)',
          backgroundSize: '100% 40px',
        }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div
              className="inline-flex items-center gap-2 mb-6
                         text-xs font-semibold text-amber-700
                         bg-amber-50 border border-amber-200
                         rounded-full px-4 py-2"
            >
              <Icon.Sparkle />
              AI-Powered Learning Platform
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold leading-[1.15] text-[#0f172a] mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              EduModern:{' '}
              <em className="not-italic text-amber-600">The Smart</em>
              <br />
              AI-Powered Educational Platform
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-md">
              Learning is now easier than ever. Our AI assistant answers your questions
              in real-time, backed by smart synchronized notes that you can review and download
              instantly — giving you a truly modern academic experience.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link
                to="/register"
                id="hero-get-started-btn"
                className="
                  group inline-flex items-center gap-2
                  text-sm font-semibold text-[#0f172a]
                  bg-amber-500 hover:bg-amber-400
                  px-7 py-3.5 rounded-xl
                  shadow-sm shadow-amber-200
                  transition-all duration-200
                  hover:-translate-y-0.5 active:scale-95
                "
              >
                Get Started
                <span className="group-hover:translate-x-1 transition-transform duration-200">
                  <Icon.ArrowRight />
                </span>
              </Link>
              <Link
                to="/courses"
                id="hero-courses-catalog-btn"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#0f172a] bg-white hover:bg-amber-50 border border-slate-300 hover:border-amber-400 px-6 py-3.5 rounded-xl transition-all duration-200 shadow-sm"
              >
                Browse Catalog
              </Link>
              <Link
                to="/login"
                className="text-sm font-medium text-slate-500 hover:text-slate-800 underline underline-offset-4 transition-colors duration-200"
              >
                Already have an account?
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-amber-200/40 to-slate-200/30 rounded-3xl blur-xl" />
            <div className="relative bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
              <div className="bg-[#0f172a] px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
                </div>
                <span className="text-[11px] font-medium text-slate-400">Classroom: Modern Software Architecture</span>
                <span className="inline-flex items-center gap-1.5 text-[10px] text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  LIVE AI
                </span>
              </div>

              <div className="p-6 bg-slate-900 text-white">
                <div className="h-44 rounded-xl bg-slate-800 border border-slate-700/60 flex flex-col items-center justify-center text-center p-4 relative overflow-hidden">
                  <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center text-[#0f172a] font-bold text-lg mb-2 shadow-md">
                    ▶
                  </div>
                  <p className="text-xs text-slate-300 font-medium">Modular System Design &amp; Domain Modeling</p>
                  <p className="text-[10px] text-slate-500 mt-1 mb-2">Lesson 04 · 32:45 remaining</p>

                  <div className="w-full max-w-xs bg-slate-950/90 backdrop-blur-sm border border-amber-500/30 rounded-lg px-3 py-1.5 flex items-center justify-between text-[10px] text-slate-300 shadow-sm">
                    <span className="flex items-center gap-1.5 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                      <strong className="text-amber-400 flex-shrink-0">AI Tutor:</strong>
                      <span className="truncate">"Explaining CQRS and Domain Events..."</span>
                    </span>
                    <span className="text-amber-300/80 font-mono text-[9px] flex-shrink-0 ml-1">0.3s reply</span>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-5 bg-white border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                <span className="inline-flex items-center gap-1.5 text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full text-[11px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Live AI Assistant: Instant Answers
                </span>
                <span className="inline-flex items-center gap-1.5 text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full text-[11px] font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-amber-600">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Smart Notes (Ready to Download)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsBanner() {
  const stats = [
    { number: '10K+', label: 'Enrolled Students', desc: 'Active academic learners' },
    { number: '50+', label: 'Expert Instructors', desc: 'Industry & faculty leaders' },
    { number: '100%', label: 'Online & Flexible', desc: 'Self-paced course modules' },
    { number: '4.9/5', label: 'Satisfaction Rate', desc: 'From 3,200+ student reviews' },
  ];

  return (
    <section className="bg-[#fdfbf7] py-10 px-6 border-y border-[#e8e4dc]">
      <div className="max-w-6xl mx-auto">
        <div className="bg-[#0f172a] rounded-2xl p-8 sm:p-10 shadow-xl border border-slate-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-800">
            {stats.map((item, idx) => (
              <div key={item.label} className={`text-center ${idx !== 0 ? 'pt-6 md:pt-0 md:pl-6' : ''}`}>
                <div
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold text-amber-500 mb-1"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {item.number}
                </div>
                <div className="text-sm font-semibold text-white tracking-wide mb-1">
                  {item.label}
                </div>
                <div className="text-xs text-slate-400">
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PremiumFeatures() {
  const features = [
    {
      title: 'Interactive Learning',
      subtitle: 'Dynamic AI Co-Pilot',
      desc: 'Engage with AI-assisted video lessons that pause and clarify key moments on demand. Ask questions and receive contextual guidance in milliseconds.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
          <polygon points="5 3 19 12 5 21 5 3"/>
        </svg>
      ),
      badge: 'Real-time AI',
    },
    {
      title: 'Expert Curriculum',
      subtitle: 'Accredited Faculty',
      desc: 'Masterfully curated syllabi designed and vetted by university professors and senior software engineers. Built around modern enterprise standards.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
          <path d="M6 12v5c3 3 9 3 12 0v-5"/>
        </svg>
      ),
      badge: 'Faculty Reviewed',
    },
    {
      title: 'Lifetime Access',
      subtitle: 'Perpetual Growth',
      desc: 'Enjoy uninterrupted, lifetime access to all enrolled coursework, modular updates, quizzes, and collaborative community forums across all devices.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
      badge: 'Always Available',
    },
  ];

  return (
    <section className="bg-[#fdfbf7] py-20 px-6 border-b border-[#e8e4dc]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] font-bold uppercase tracking-widest text-amber-700 bg-amber-100 border border-amber-200 px-3.5 py-1 rounded-full">
            Academic Excellence
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold text-[#0f172a] mt-4 mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Built for Serious Academic Achievement
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Every feature on EduModern is engineered to make high-level computer science, engineering, and digital skills intuitive, rigorous, and rewarding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-2xl p-8 border border-[#e8e4dc] shadow-sm hover:shadow-xl hover:border-amber-400 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-semibold text-amber-700 uppercase tracking-widest bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                </div>
                <h3
                  className="text-xl font-bold text-[#0f172a] mb-1"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {item.title}
                </h3>
                <div className="text-xs font-semibold text-amber-600 mb-3 tracking-wide">
                  {item.subtitle}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-[#0f172a]">
                <span className="text-amber-600 mr-2">✓</span> Accredited Learning Standard
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const reviews = [
    {
      name: 'Omar Farouk',
      role: 'Full-Stack Engineering Student',
      initials: 'OF',
      quote:
        'EduModern revolutionized how I master complex architecture. The real-time AI context notes saved me countless hours of re-watching lectures.',
      rating: 5,
    },
    {
      name: 'Yasmine Tarek',
      role: 'Data Science & AI Learner',
      initials: 'YT',
      quote:
        'The structured curriculum and seamless hands-on modules helped me transition into AI engineering with genuine confidence and clarity.',
      rating: 5,
    },
    {
      name: 'Kareem Adel',
      role: 'Backend .NET Developer',
      initials: 'KA',
      quote:
        'Top-tier platform aesthetic and curriculum depth. Easily the most premium and distraction-free learning experience I have encountered online.',
      rating: 5,
    },
  ];

  return (
    <section className="bg-[#fdfbf7] py-20 px-6 border-b border-[#e8e4dc]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-[11px] font-bold uppercase tracking-widest text-amber-700 bg-amber-100 border border-amber-200 px-3.5 py-1 rounded-full">
            Student Voices
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold text-[#0f172a] mt-4 mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Trusted by Thousands of Students
          </h2>
          <p className="text-sm text-slate-600">
            Read authentic reviews from learners mastering technology and design with EduModern.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev) => (
            <div
              key={rev.name}
              className="bg-white rounded-2xl p-7 border border-[#e8e4dc] shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-4" aria-label="5 stars">
                  {[...Array(rev.rating)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ))}
                </div>
                <blockquote className="text-slate-700 text-sm leading-relaxed italic mb-6">
                  "{rev.quote}"
                </blockquote>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0f172a] text-amber-400 font-bold text-xs flex items-center justify-center border border-amber-500/30">
                  {rev.initials}
                </div>
                <div>
                  <div className="text-sm font-bold text-[#0f172a]" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {rev.name}
                  </div>
                  <div className="text-xs text-slate-500">{rev.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      num: '01',
      title: 'Select Your Discipline',
      desc: 'Browse through accredited courses spanning software engineering, system architecture, database internals, and machine learning.',
    },
    {
      num: '02',
      title: 'Learn with Real-Time AI',
      desc: 'As video lectures play, ask questions in real time. The AI understands the exact timestamp context and delivers precise answers.',
    },
    {
      num: '03',
      title: 'Master and Build',
      desc: 'Complete hands-on assignments, test your retention with modular checkpoints, and graduate with verified engineering credentials.',
    },
  ];

  return (
    <section className="bg-[#fdfbf7] py-20 px-6 border-b border-[#e8e4dc]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-[11px] font-bold uppercase tracking-widest text-amber-700 bg-amber-100 border border-amber-200 px-3.5 py-1 rounded-full">
            Methodology
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold text-[#0f172a] mt-4 mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            How EduModern Works
          </h2>
          <p className="text-sm text-slate-600">
            A seamless path from foundational theory to career-defining execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((st) => (
            <div key={st.num} className="relative p-8 rounded-2xl bg-white border border-[#e8e4dc] shadow-sm">
              <span
                className="text-5xl font-bold text-amber-500/20 block mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {st.num}
              </span>
              <h3 className="text-lg font-bold text-[#0f172a] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                {st.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {st.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="bg-[#0f172a] py-20 px-6 text-white text-center">
      <div className="max-w-3xl mx-auto">
        <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full">
          Start Today
        </span>
        <h2
          className="text-3xl sm:text-5xl font-bold mt-5 mb-4 text-white"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Elevate Your Education Today
        </h2>
        <p className="text-sm sm:text-base text-slate-400 max-w-lg mx-auto mb-8 leading-relaxed">
          Join thousands of learners accessing world-class instruction paired with real-time artificial intelligence.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-[#0f172a] font-bold text-sm px-8 py-3.5 rounded-xl shadow-lg shadow-amber-500/20 transition-all duration-200 hover:-translate-y-0.5"
          >
            Begin Free Registration
            <Icon.ArrowRight />
          </Link>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 bg-transparent hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 hover:border-amber-400 font-semibold text-sm px-7 py-3.5 rounded-xl transition-all duration-200"
          >
            Browse Course Catalog
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#0f172a] border-t border-slate-800 py-10 px-6 text-slate-400 text-xs">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-amber-500 flex items-center justify-center font-bold text-[#0f172a] text-xs">
            E
          </div>
          <span className="text-white font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
            EduModern
          </span>
        </div>
        <p>© {new Date().getFullYear()} EduModern Platform. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: FONT_IMPORT }} />
      <div className="min-h-screen bg-[#fdfbf7] antialiased" style={{ fontFamily: "'Inter', sans-serif" }}>
        <Navbar />
        <main>
          <HeroSection />

          <StatsBanner />

          <PremiumFeatures />

          <TestimonialsSection />

          <HowItWorksSection />

          <CTASection />
        </main>
        <Footer />
      </div>
    </>
  );
}
