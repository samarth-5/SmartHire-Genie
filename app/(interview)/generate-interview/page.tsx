'use client';

import Agent from '@/components/Agent';
import { AuthGuard } from '@/firebase/AuthGuard';
import React from 'react';

export default function InterviewGenerationPage() {
  return (
    <AuthGuard>
      {/* ── main wrapper ───────────────────────────────────────── */}
      <main className="min-h-screen bg-teal-100 text-teal-800 py-20 mt-4 sm:mt-10">
        {/* ── responsive header ─────────────────────────────────── */}
        <header className="flex flex-col items-center px-6 gap-2
                            sm:flex-row sm:items-center sm:px-10
                            lg:px-30">
          <span className="text-4xl sm:text-5xl">🤖</span>

          <h2 className="text-2xl text-center font-extrabold text-teal-900 leading-tight
                         sm:text-3xl sm:text-left">
            Generate your customised Interview
          </h2>
        </header>

        <Agent />
      </main>
    </AuthGuard>
  );
}
