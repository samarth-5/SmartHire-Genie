'use client';

import React from 'react';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Companies from '@/components/Companies';
import WorkflowSection from '@/components/Workflow';
import CallToAction from '@/components/CallToAction';
  
export default function HomePage() {
  return (
    <main className="min-h-screen w-full flex flex-col font-sans antialiased">
      <Hero />
      <Features />
      <WorkflowSection />
      <Companies />
      <CallToAction />
    </main>
  );
}  