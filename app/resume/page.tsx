'use client';

import { AuthGuard } from '@/firebase/AuthGuard';
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

  return (
    <AuthGuard>
    <div className="relative min-h-screen bg-teal-100 px-4 py-30 sm:px-10 lg:px-40">
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-teal-300/70 backdrop-blur-md">
          <span className="animate-pulse text-xl font-semibold text-teal-900 sm:text-2xl">
            Parsing resume…
          </span>
        </div>
      )}

      {/* Card */}
      <div className="mx-auto w-full max-w-lg sm:max-w-2xl lg:max-w-3xl rounded-xl bg-teal-200 p-4 shadow-lg sm:p-6 lg:p-8">
        <h1 className="mb-6 text-2xl font-bold text-teal-900 sm:text-3xl">
          Upload Your Resume
        </h1>

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <span className="flex-1 truncate rounded border bg-white px-3 py-2 text-teal-900">
            {file ? file.name : 'No file chosen'}
          </span>

          <input
            id="resume-upload"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
          />

          <label
            htmlFor="resume-upload"
            className="shrink-0 cursor-pointer rounded bg-teal-400 px-4 py-2 font-semibold text-white transition-colors hover:bg-teal-500 w-fit"
          >
            Browse&nbsp;File
          </label>
        </div>

        <h2 className="mb-2 text-lg font-semibold text-teal-800 sm:text-xl">
          Paste Job Description
        </h2>
        <textarea
          rows={6}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          className="w-full resize-none rounded border bg-white p-3"
          placeholder="Enter the job description here..."
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-4 rounded bg-teal-400 px-4 py-2 font-semibold text-white transition-colors hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Submit Resume
        </button>

        {feedback && (
          <div className="mt-8 rounded bg-teal-300 p-4 text-teal-900 whitespace-pre-wrap">
            <h3 className="mb-2 text-xl font-bold sm:text-2xl">Feedback</h3>
            {feedback}
          </div>
        )}
      </div>
    </div>
    </AuthGuard>
  );
}
