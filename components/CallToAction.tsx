'use client';

import Link from 'next/link';
import React from 'react';
import { toast } from 'react-hot-toast';
import { auth } from '../firebase/auth';

export default function CallToAction() {
  const handleStartClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!auth?.currentUser) {
      e.preventDefault();
      toast.error('Log in to begin your journey!');
      return;
    }
  };

  return (
    <section className="bg-teal-500 pt-20 pb-0 px-4 text-center text-white flex flex-col items-center gap-6">
      <div className="pb-8">
        <h3 className="text-3xl md:text-4xl font-bold">
          Ready to ace your next interview?
        </h3>
        <p className="mt-4 text-white/80">
          Jump in and start practicing — it’s free.
        </p>
        <Link
          href="/dashboard"
          onClick={handleStartClick}
          className="inline-block mt-8 bg-white text-teal-700 font-medium px-8 py-3 rounded-full shadow-md hover:bg-teal-100 hover:scale-105 transition"
        >
          Go to Dashboard
        </Link>
      </div>

      <Link
        href="/about"
        className="text-sm text-black hover:text-black/80 hover:underline transition py-3 font-bold"
      >
        © 2025&nbsp;Developed&nbsp;by&nbsp;@Samarth.&nbsp;All&nbsp;rights&nbsp;reserved.
      </Link>
    </section>
  );
}