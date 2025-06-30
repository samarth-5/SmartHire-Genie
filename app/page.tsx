'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Companies from '@/components/Companies';
import WorkflowSection from '@/components/Workflow';
  
export default function HomePage() {
  return (
    <main className="min-h-screen w-full flex flex-col font-sans antialiased">
      <Navbar />
      <Hero />
      <Features />
      <WorkflowSection />
      <Companies />
      <CallToAction />
    </main>
  );
}
   

   function CallToAction() {
     return (
       <section className="bg-teal-500 py-20 px-4 text-center text-white">
         <h3 className="text-3xl md:text-4xl font-bold">Ready to ace your next interview?</h3>
         <p className="mt-4 text-white/80">Jump in and start practicing — it’s free.</p>
         <Link href="/interview" className="inline-block mt-8 bg-white text-teal-700 font-medium px-8 py-3 rounded-full shadow-md hover:bg-teal-100 hover:scale-105 transition">
           Start Now
         </Link>
       </section>
     );
   }
   