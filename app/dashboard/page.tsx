'use-client';

import { AuthGuard } from '@/firebase/AuthGuard';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Dashboard | SmartHireGenie',
  description: 'Manage resume reviews, practice interviews, and feedback in one place.',
};

export default function DashboardPage() {
  return (
    <AuthGuard>
      <main className="min-h-screen bg-teal-100 text-teal-800 px-4 py-20 mt-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            
            <section className="flex flex-col gap-5 rounded-2xl border border-teal-300 bg-teal-200/70 backdrop-blur p-8 shadow-lg">
              <header className="flex items-center gap-4">
                <span className="text-4xl">✨</span>
                <h2 className="text-3xl font-extrabold text-teal-900">Boost Your Resume</h2>
              </header>
              <p className="leading-relaxed text-teal-700">
                Get an ATS‑friendly resume review &amp; actionable tips to stand out. Our AI analyses
                formatting, keywords, and impact.
              </p>
              <Link href="/resume" className="self-center md:self-start">
                <button className="hover:cursor-pointer rounded-full bg-teal-600 px-6 py-2.5 text-base font-medium text-white transition-colors hover:bg-teal-700">
                  Review my Resume
                </button>
              </Link>
            </section>

            <section className="flex flex-col gap-5 rounded-2xl border border-teal-300 bg-teal-200/70 backdrop-blur p-8 shadow-lg">
              <header className="flex items-center gap-4">
                <span className="text-4xl">🤖</span>
                <h2 className="text-3xl font-extrabold text-teal-900">Generate Practice Interviews</h2>
              </header>
              <p className="text-base leading-relaxed text-teal-700">
                Craft realistic interview sessions tailored to your role. Select skills &amp; difficulty
                for technical and behavioural rounds.
              </p>
              <Link href="/generate-interview" className="self-center md:self-start">
                <button className="hover:cursor-pointer rounded-full border border-teal-500 px-6 py-2.5 text-base font-medium text-teal-700 transition-colors hover:bg-teal-300/50">
                  Generate an Interview
                </button>
              </Link>
            </section>
          </div>

          <section className="flex flex-col gap-5 rounded-2xl border border-teal-300 bg-teal-200/70 backdrop-blur p-8 shadow-lg">
            <header className="flex items-center gap-4">
              <span className="text-4xl">📄</span>
              <h2 className="text-3xl font-extrabold text-teal-900">Your Interviews</h2>
            </header>
            <p className="text-teal-700">
              You haven&apos;t completed any interviews yet. Generate one above to get started!
            </p>
          </section>

          {/* Upcoming Interviews */}
          <section className="flex flex-col gap-5 rounded-2xl border border-teal-300 bg-teal-200/70 backdrop-blur p-8 shadow-lg">
            <header className="flex items-center gap-4">
              <span className="text-4xl">📅</span>
              <h2 className="text-3xl font-extrabold text-teal-900">Upcoming Interviews</h2>
            </header>
            <p className="text-teal-700">No upcoming interviews scheduled.</p>
          </section>
        </div>
      </main>

      <footer className="bg-teal-100 pb-3 text-center">
        <Link
          href="/about"
          className="text-sm font-bold text-black transition hover:text-black/80 hover:underline"
        >
          © 2025&nbsp;Developed&nbsp;by&nbsp;@Samarth.&nbsp;All&nbsp;rights&nbsp;reserved.
        </Link>
      </footer>
    </AuthGuard>
  );
}
