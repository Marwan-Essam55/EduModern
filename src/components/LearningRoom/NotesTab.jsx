
import React, { useState, useCallback } from 'react';

function DownloadIcon({ className = 'w-4 h-4' }) {
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
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

export default function NotesTab() {
  const [notes, setNotes] = useState('');

  const handleDownload = useCallback(() => {
    const blob = new Blob([notes], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'Lesson_Notes.txt';
    a.click();
    URL.revokeObjectURL(url);
  }, [notes]);

  return (
    <div className="flex flex-col gap-3 h-full">

      <textarea
        id="notes-scratchpad"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Start typing your notes here..."
        aria-label="Lesson notes"
        spellCheck
        className="
          flex-1
          w-full resize-none
          bg-white border border-gray-200
          text-gray-800 placeholder-gray-400
          rounded-xl px-4 py-4
          text-sm leading-7
          outline-none
          transition-colors duration-150
          focus:border-indigo-300 focus:ring-2 focus:ring-indigo-50
          min-h-[380px]
        "
      />

      <div className="flex items-center justify-between px-0.5">

        <span className="text-[11px] text-gray-400 tabular-nums select-none">
          {notes.length > 0
            ? `${notes.length} character${notes.length !== 1 ? 's' : ''}`
            : 'Empty'}
        </span>

        <button
          id="notes-download-btn"
          type="button"
          onClick={handleDownload}
          disabled={notes.trim().length === 0}
          aria-label="Download notes as a text file"
          className="
            inline-flex items-center gap-2
            text-xs font-medium
            px-4 py-2 rounded-lg
            text-gray-600 bg-gray-100 border border-gray-200
            hover:bg-gray-200 hover:text-gray-800 hover:border-gray-300
            active:scale-95
            transition-all duration-150
            disabled:opacity-40 disabled:cursor-not-allowed
            disabled:hover:bg-gray-100 disabled:hover:text-gray-600
            disabled:hover:border-gray-200
          "
        >
          <DownloadIcon />
          Download Notes (.txt)
        </button>
      </div>

    </div>
  );
}
