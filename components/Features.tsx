import { BadgeCheck, FileText, Sparkles } from 'lucide-react';
import React from 'react'

type FeatureCardProps = {
    Icon: React.ComponentType<{ className?: string }>;
    title: string;
    text: string;
};

export default function Features() {
    return (
      <section className="py-24 px-4 bg-teal-200 text-teal-900">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Why SmartHire Genie ?</h2>
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
