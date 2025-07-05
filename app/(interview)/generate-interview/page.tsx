'use-client';

import Agent from '@/components/Agent'
import { AuthGuard } from '@/firebase/AuthGuard';
import React from 'react'

export default function InterviewGenerationPage() {
  return (
    <AuthGuard>
    <main className="min-h-screen bg-teal-100 text-teal-800 px-30 py-20 mt-10">
        <header className="flex items-center gap-4">         
            <span className="text-4xl">🤖</span>
            <h2 className="text-3xl font-extrabold text-teal-900">Generate your customised Interview</h2>
        </header>
        <Agent />
    </main>
    </AuthGuard>
  )
}