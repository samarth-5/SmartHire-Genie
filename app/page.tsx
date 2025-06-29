'use client';

import React, { useState, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  BadgeCheck,
  Sparkles,
  FileText,
  Building,
  Briefcase,
  ListChecks,
  Mic,
  BarChart3,
  TrendingUp,
  ArrowBigDownDash,
  ArrowRight,
  Menu,
  X,
} from 'lucide-react';
import Navbar from '@/components/Navbar';

type ButtonProps = {
  href: string;
  children: ReactNode;
};
   
   
type FeatureCardProps = {
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
};
   
type StepData = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
};
  
export default function HomePage() {
  return (
    <main className="min-h-screen w-full flex flex-col font-sans antialiased">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <WorkflowSection />
      <CallToAction />
    </main>
  );
}
   
function Header() {
  
   }
   
   
   
   /* ------------------------------------------------------------------
      Buttons
      ------------------------------------------------------------------ */
   function FancyButton({ href, children }: ButtonProps) {
     return (
       <Link
         href={href}
         className="relative inline-flex items-center justify-center px-6 py-3 font-semibold text-white bg-teal-600 rounded-full shadow-md hover:-translate-y-1 hover:shadow-xl active:scale-95 transition duration-200"
       >
         {children}
       </Link>
     );
   }
   
   function GhostButton({ href, children }: ButtonProps) {
     return (
       <Link
         href={href}
         className="relative inline-flex items-center justify-center px-6 py-3 font-semibold text-black border border-black rounded-full hover:bg-teal-300 hover:-translate-y-1 active:scale-95 transition duration-200"
       >
         {children}
       </Link>
     );
   }
   
   /* ------------------------------------------------------------------
      Hero Section
      ------------------------------------------------------------------ */
   function HeroSection() {
     return (
       <section className="pt-32 pb-20 px-4 bg-teal-100 text-teal-900 md:pt-40 md:pb-28">
         <div className="max-w-7xl mx-auto grid gap-10 items-center md:grid-cols-2">
           {/* Text */}
           <div>
             <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
               Get Interview‑Ready with
               <br className="hidden md:inline" />
               <span className="text-teal-600"> AI‑Powered Practice & Feedback</span>
             </h1>
             <p className="max-w-xl text-lg mb-10">
               Practice real technical interview questions, receive instant feedback, and boost your confidence — all in one place.
             </p>
             <div className="flex gap-4 flex-wrap">
               <FancyButton href="/interview">Start an Interview</FancyButton>
               <GhostButton href="#workflow">See How It Works</GhostButton>
             </div>
           </div>
   
           {/* Image */}
           <div className="flex justify-center md:justify-end">
             <Image
               src="/robot.png"
               alt="AI Interview Assistant"
               width={520}
               height={420}
               className="h-[240px] md:h-[420px] w-auto object-contain"
               priority
             />
           </div>
         </div>
       </section>
     );
   }
   
   /* ------------------------------------------------------------------
      Features Section
      ------------------------------------------------------------------ */
   function FeaturesSection() {
     return (
       <section className="py-24 px-4 bg-teal-200 text-teal-900">
         <div className="max-w-6xl mx-auto text-center">
           <h2 className="text-3xl md:text-4xl font-bold mb-6">Why SmartHire Genie?</h2>
           <p className="max-w-2xl mx-auto text-teal-800">
             Everything you need to conquer your next interview — packed into a single, lightning‑fast web app.
           </p>
         </div>
         <div className="mt-16 grid sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
           <FeatureCard Icon={Sparkles} title="AI‑Driven Questions" text="Auto‑tailored to your tech stack and experience." />
           <FeatureCard Icon={FileText} title="Instant Feedback" text="Real‑time scoring and actionable insights." />
           <FeatureCard Icon={BadgeCheck} title="Resume Review" text="Upload your CV and get line‑by‑line suggestions." />
         </div>
       </section>
     );
   }
   
   function FeatureCard({ Icon, title, text }: FeatureCardProps) {
     return (
       <div className="p-6 bg-teal-400/30 rounded-2xl shadow-md hover:shadow-lg transition text-center flex flex-col items-center justify-center h-full">
         <Icon className="h-12 w-12 mb-4 text-teal-800" />
         <h3 className="text-lg font-semibold mb-2 text-teal-900">{title}</h3>
         <p className="text-sm text-teal-800">{text}</p>
       </div>
     );
   }
   
   /* ------------------------------------------------------------------
      Workflow Section
      ------------------------------------------------------------------ */
   function WorkflowSection() {
     return (
       <section id="workflow" className="py-24 px-4 bg-teal-300 text-teal-900">
         <div className="max-w-4xl mx-auto text-center">
           <h2 className="text-3xl md:text-4xl font-bold mb-12">How It Works</h2>
           <div className="flex flex-col md:flex-row items-center justify-center gap-6">
             {steps.map(({ icon: Icon, label }, i) => (
               <React.Fragment key={label}>
                 <Step icon={<Icon />} label={label} />
                 {i < steps.length - 1 && (
                   <>
                     <ArrowRight className="hidden md:inline-block h-5 w-5 text-teal-700" />
                     <ArrowBigDownDash className="md:hidden h-6 w-6 text-teal-700" />
                   </>
                 )}
               </React.Fragment>
             ))}
           </div>
         </div>
       </section>
     );
   }
   
   function Step({ icon, label }: { icon: ReactNode; label: string }) {
     return (
       <div className="flex flex-col items-center">
         <div className="h-14 w-14 rounded-full border border-teal-600 flex items-center justify-center bg-white">
           <div className="text-teal-700">{icon}</div>
         </div>
         <p className="mt-3 text-sm max-w-[130px] text-center leading-tight">{label}</p>
       </div>
     );
   }
   
   /* ------------------------------------------------------------------
      Call‑to‑Action Section
      ------------------------------------------------------------------ */
   function CallToAction() {
     return (
       <section className="bg-teal-400 py-20 px-4 text-center text-white">
         <h3 className="text-3xl md:text-4xl font-bold">Ready to ace your next interview?</h3>
         <p className="mt-4 text-white/80">Jump in and start practicing — it’s free.</p>
         <Link href="/interview" className="inline-block mt-8 bg-white text-teal-700 font-medium px-8 py-3 rounded-full shadow-md hover:bg-teal-100 hover:scale-105 transition">
           Start Now
         </Link>
       </section>
     );
   }
   
   /* ------------------------------------------------------------------
      Data
      ------------------------------------------------------------------ */
   const steps: StepData[] = [
     { icon: Building, label: 'Select Company' },
     { icon: Briefcase, label: 'Choose Position & JD' },
  { icon: ListChecks, label: 'Pick Interview Type' },
  { icon: Mic, label: 'Take the Interview' },
  { icon: BarChart3, label: 'Report + Rating' },
  { icon: TrendingUp, label: 'Improve' },
];
