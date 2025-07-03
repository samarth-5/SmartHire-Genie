'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const MAX_FILE_SIZE_MB = 1;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile && uploadedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error('File size must be less than 1 MB.');
      e.target.value = '';
      setFile(null);
    } else {
      setFile(uploadedFile || null);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error('No Resume uploaded!');
      return;
    }
    if (!jobDescription.trim()) {
      toast.error('No job description provided!');
      return;
    }

    setLoading(true);
    setFeedback(null);

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDescription);

    try {
      const res = await fetch('/api/analyze-resume', { method: 'POST', body: formData });
      const data = await res.json();
      setFeedback(data.feedback);
    } catch {
      setFeedback('Error processing resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* ---------- JSX ---------- */
  return (
    <div className="relative min-h-screen bg-teal-100 p-40">
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-teal-300 bg-opacity-70 backdrop-blur-md z-50">
          <span className="text-2xl font-semibold text-teal-900 animate-pulse">
            Parsing resume…
          </span>
        </div>
      )}

      {/* Card */}
      <div className="max-w-3xl mx-auto bg-teal-200 p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-teal-900 mb-6">Upload Your Resume</h1>

        {/* ---------- Resume picker ---------- */}
        <div className="mb-4 flex items-center gap-3">
          {/* Status box now stretches full width */}
          <span className="flex-1 px-3 py-2 bg-white border rounded text-teal-900 truncate">
            {file ? file.name : 'No file chosen'}
          </span>

          {/* Hidden input */}
          <input
            id="resume-upload"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Button‑look label */}
          <label
            htmlFor="resume-upload"
            className="shrink-0 cursor-pointer bg-teal-400 hover:bg-teal-500 text-white font-semibold py-2 px-4 rounded transition-colors"
          >
            Browse&nbsp;File
          </label>
        </div>

        {/* ---------- Job description area ---------- */}
        <h2 className="text-xl font-semibold text-teal-800 mb-2">Paste Job Description</h2>
        <textarea
          rows={6}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          className="w-full p-3 border rounded resize-none bg-white"
          placeholder="Enter the job description here..."
        />

        {/* ---------- Submit button ---------- */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="hover:cursor-pointer mt-4 bg-teal-400 text-white font-semibold py-2 px-4 rounded hover:bg-teal-500 disabled:opacity-50"
        >
          Submit Resume
        </button>

        {/* ---------- Feedback ---------- */}
        {feedback && (
          <div className="mt-8 bg-teal-300 p-4 rounded text-teal-900 whitespace-pre-wrap">
            <h3 className="text-2xl font-bold mb-2">Feedback</h3>
            {feedback}
          </div>
        )}
      </div>
    </div>
  );
}
