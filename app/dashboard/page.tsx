// app/dashboard/page.tsx
import Navbar from '@/components/Navbar';
import { Metadata } from 'next';
import Link from 'next/link';

/**
 * Dashboard Page — Teal Palette (light)
 * ------------------------------------
 * Uses bg‑teal‑100/200/300/400 and heading accents text‑teal‑900/600.
 * Font sizes bumped for better hierarchy.
 */

export const metadata: Metadata = {
  title: 'Dashboard | SmartHireGenie',
  description: 'Manage resume reviews, practice interviews, and feedback in one place.'
};

export default function DashboardPage() {
  return (
    <>
    <Navbar />
    <main className="min-h-screen bg-teal-100 text-teal-800 px-4 py-20 mt-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        {/* ── Top Row ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Resume Review */}
          <section className="flex flex-col gap-5 rounded-2xl border border-teal-300 bg-teal-200/70 backdrop-blur p-8 shadow-lg">
            <header className="flex items-center gap-4">
              <span className="text-4xl">✨</span>
              <h2 className="text-3xl font-extrabold text-teal-900">Boost Your Resume</h2>
            </header>
            <p className="text-base leading-relaxed text-teal-700">
              Get an ATS‑friendly resume review & actionable tips to stand out. Our AI analyses
              formatting, keywords, and impact.
            </p>
            <Link href="/resume-review" className="self-start">
              <button
                className="rounded-full bg-teal-600 px-6 py-2.5 text-base font-medium text-white transition-colors hover:bg-teal-700"
              >
                Review my Resume
              </button>
            </Link>
          </section>

          {/* Interview Generator */}
          <section className="flex flex-col gap-5 rounded-2xl border border-teal-300 bg-teal-200/70 backdrop-blur p-8 shadow-lg">
            <header className="flex items-center gap-4">
              <span className="text-4xl">📝</span>
              <h2 className="text-3xl font-extrabold text-teal-900">Generate Practice Interviews</h2>
            </header>
            <p className="text-base leading-relaxed text-teal-700">
              Craft realistic interview sessions tailored to your role. Select skills & difficulty
              for technical and behavioural rounds.
            </p>
            <Link href="/generate-interview" className="self-start">
              <button
                className="rounded-full border border-teal-500 px-6 py-2.5 text-base font-medium text-teal-700 transition-colors hover:bg-teal-300/50"
              >
                Start Interview
              </button>
            </Link>
          </section>
        </div>

        {/* ── Completed Interviews ─────────────────────────────── */}
        <section className="flex flex-col gap-5 rounded-2xl border border-teal-300 bg-teal-200/70 backdrop-blur p-8 shadow-lg">
          <header className="flex items-center gap-4">
            <span className="text-4xl">📄</span>
            <h2 className="text-3xl font-extrabold text-teal-900">Your Interviews</h2>
          </header>
          <p className="text-teal-700">
            You haven&apos;t completed any interviews yet. Generate one above to get started!
          </p>
          <Link href="/interviews" className="self-start">
            <button
              className="rounded-full border border-teal-500 px-6 py-2.5 text-base font-medium text-teal-700 transition-colors hover:bg-teal-300/50"
            >
              View All
            </button>
          </Link>
        </section>

        {/* ── Upcoming Interviews ─────────────────────────────── */}
        <section className="flex flex-col gap-5 rounded-2xl border border-teal-300 bg-teal-200/70 backdrop-blur p-8 shadow-lg">
          <header className="flex items-center gap-4">
            <span className="text-4xl">📅</span>
            <h2 className="text-3xl font-extrabold text-teal-900">Upcoming Interviews</h2>
          </header>
          <p className="text-teal-700">No upcoming interviews scheduled.</p>
          <Link href="/schedule" className="self-start">
            <button
              className="rounded-full bg-teal-600 px-6 py-2.5 text-base font-medium text-white transition-colors hover:bg-teal-700"
            >
              Schedule New
            </button>
          </Link>
        </section>
      </div>
    </main>
    </>
  );
}