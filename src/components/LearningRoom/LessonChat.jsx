
import React, { useState, useRef, useEffect, useCallback } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'https://edumodern-api.runasp.net';

function SendIcon({ className = 'w-4 h-4' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function AISparklesIcon({ className = "w-5 h-5" }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      strokeWidth="1.5" 
      stroke="currentColor" 
      className={className}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09l2.846.813-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  );
}

function ThinkingRow() {
  return (
    <div className="flex items-start gap-3 animate-fadeSlideIn">
      <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center">
        <span className="text-[10px] font-bold text-indigo-600 tracking-tight select-none">AI</span>
      </span>
      <div className="flex items-center gap-1.5 py-2">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse delay-75" />
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse delay-150" />
        <span className="ml-1.5 text-xs text-gray-400 italic select-none">Thinking…</span>
      </div>
    </div>
  );
}

function MessageRow({ message }) {
  const isUser  = message.sender === 'user';
  const isError = message.sender === 'error';

  if (isUser) {
    return (
      <div className="flex items-start gap-3 flex-row-reverse animate-fadeSlideIn">
        <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-indigo-600 shadow-sm flex items-center justify-center">
          <span className="text-[10px] font-semibold text-white select-none">You</span>
        </span>
        <div
          className="max-w-[78%] bg-indigo-600 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm leading-relaxed shadow-sm"
          style={{ unicodeBidi: 'plaintext', textAlign: 'start' }}
        >
          {message.text}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-start gap-3 animate-fadeSlideIn">
        <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-red-50 border border-red-200 flex items-center justify-center">
          <span className="text-[10px] text-red-500 select-none font-medium">!</span>
        </span>
        <div className="max-w-[78%] bg-red-50 border border-red-100 text-red-700 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm leading-relaxed">
          {message.text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 animate-fadeSlideIn">
      <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm">
        <span className="text-[10px] font-bold text-indigo-600 tracking-tight select-none">AI</span>
      </span>
      <div
        className="max-w-[78%] bg-white border border-gray-200 text-gray-700 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap shadow-sm"
        style={{ unicodeBidi: 'plaintext', textAlign: 'start' }}
      >
        {message.text}
      </div>
    </div>
  );
}

function EmptyState({ onSuggestionClick }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-5 select-none px-6 text-center">
      <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm">
        <AISparklesIcon className="w-6 h-6 text-indigo-500" />
      </div>

      <div>
        <h3 className="text-base font-semibold text-gray-800">Ask the AI about this lesson</h3>
        <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
          Get instant explanations, examples, or summaries.<br />
          You can type in English or Arabic.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center mt-2">
        {[
          'Explain this concept',
          'Give me an example',
          'Summarise this lesson',
        ].map((hint) => (
          <button
            key={hint}
            onClick={() => onSuggestionClick(hint)}
            className="text-xs font-medium text-indigo-700 bg-white border border-indigo-200 rounded-full px-4 py-2 hover:bg-indigo-50 hover:border-indigo-300 transition-all active:scale-95 shadow-sm cursor-pointer"
          >
            {hint}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function LessonChat({ currentLesson, lessonId: propLessonId }) {
  const [messages, setMessages]   = useState([]);
  const [question, setQuestion]   = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);

  const resolvedId = currentLesson?.id ?? propLessonId ?? 1;
  const resolvedTitle = currentLesson?.title || "01. What is .NET? [Pt 1]";
  const resolvedContent = currentLesson?.content || "What is .NET? An introduction to the .NET 8 ecosystem, Common Language Runtime (CLR), C#, and building high-performance modern backend APIs with .NET.";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = useCallback(async (e, overrideText = null) => {
    if (e) e.preventDefault();
    const textToSend = overrideText || question.trim();
    if (!textToSend || isLoading) return;

    setMessages((prev) => [...prev, { id: Date.now(), sender: 'user', text: textToSend }]);
    setQuestion('');
    if (inputRef.current) inputRef.current.style.height = 'auto';
    setIsLoading(true);

    try {
      const token = localStorage.getItem('edu_token') || localStorage.getItem('token') || '';
      
      const payload = {
        lessonId: resolvedId,
        lessonTitle: resolvedTitle,
        lessonContent: resolvedContent,
        question: textToSend,
      };

      const response = await fetch(`${API_BASE}/api/Chat/Ask`, {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errMsg = `Server error (${response.status})`;
        try {
          const errBody = await response.json();
          if (errBody?.message || errBody?.error || errBody?.title) {
            errMsg = errBody.message || errBody.error || errBody.title;
          }
        } catch {
        }
        throw new Error(errMsg);
      }

      const data = await response.json();
      const botReply = data?.answer || data?.response || data?.message || data?.result || (typeof data === 'string' ? data : "I couldn't find an answer. Please try again.");

      setMessages((prev) => [
        ...prev,
        {
          id:     Date.now() + 1,
          sender: 'bot',
          text:   botReply,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id:     Date.now() + 2,
          sender: 'error',
          text:   `Could not reach the AI assistant: ${err.message}`,
        },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [question, isLoading, resolvedId, resolvedTitle, resolvedContent]);

  const handleSubmit = handleSendMessage;

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const canSubmit = question.trim().length > 0 && !isLoading;

  return (
    <section
      aria-label="AI Assistant"
      className="flex flex-col h-[500px] rounded-xl border border-gray-200 bg-gray-50/50 overflow-hidden"
    >
      <header className="flex items-center justify-between px-5 py-3 border-b border-gray-200 flex-shrink-0 bg-white">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.5)]" aria-hidden="true" />
          <h2 id="lesson-chat-title" className="text-sm font-semibold text-gray-800 tracking-tight">
            AI Assistant
          </h2>
        </div>
        <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full tabular-nums">
          Lesson #{resolvedId}
        </span>
      </header>

      <main
        className="flex-1 overflow-y-auto px-5 py-5 space-y-4 bg-[#f8fafc] scroll-smooth"
        aria-live="polite"
        aria-label="Conversation"
      >
        {messages.length === 0 && !isLoading ? (
          <EmptyState onSuggestionClick={(hint) => handleSendMessage(null, hint)} />
        ) : (
          <>
            {messages.map((msg) => (
              <MessageRow key={msg.id} message={msg} />
            ))}
            {isLoading && <ThinkingRow />}
          </>
        )}
        <div ref={messagesEndRef} aria-hidden="true" />
      </main>

      <footer className="flex-shrink-0 px-4 pb-4 pt-3 border-t border-gray-200 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
        <form
          onSubmit={handleSubmit}
          className="flex items-end gap-2"
          aria-label="Ask a question"
        >
          <textarea
            ref={inputRef}
            id="lesson-chat-input"
            rows={1}
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 96) + 'px';
            }}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Ask a question about this lesson..."
            aria-label="Your question"
            aria-describedby="lesson-chat-title"
            style={{ unicodeBidi: 'plaintext', textAlign: 'start' }}
            className="
              flex-1 resize-none
              bg-gray-50 border border-gray-200
              text-gray-800 placeholder-gray-400
              rounded-xl px-4 py-3 text-sm leading-relaxed
              outline-none transition-all duration-200
              focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50
              disabled:opacity-50 disabled:cursor-not-allowed
              min-h-[44px] max-h-24 overflow-y-auto
            "
          />

          <button
            id="lesson-chat-submit-btn"
            type="submit"
            disabled={!canSubmit}
            aria-label="Send question"
            className="
              flex-shrink-0 w-11 h-11 rounded-xl
              flex items-center justify-center
              text-white
              bg-indigo-600
              shadow-md shadow-indigo-200
              transition-all duration-200
              hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5
              active:scale-95 active:translate-y-0
              disabled:opacity-40 disabled:cursor-not-allowed
              disabled:hover:bg-indigo-600 disabled:hover:shadow-none disabled:hover:translate-y-0
            "
          >
            <SendIcon />
          </button>
        </form>

        <div className="flex justify-between items-center mt-3 px-1">
          <p className="text-[10px] text-gray-400 select-none">
            Press <kbd className="font-mono font-semibold bg-gray-100 border border-gray-200 rounded px-1.5 py-0.5">Enter</kbd> to send
            &nbsp;·&nbsp;
            <kbd className="font-mono font-semibold bg-gray-100 border border-gray-200 rounded px-1.5 py-0.5">Shift+Enter</kbd> for new line
          </p>
        </div>
      </footer>
    </section>
  );
}