'use client';

import React, { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { auth } from '../firebase/auth';

type ButtonProps = {
  href: string;
  children: ReactNode;
};

export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 bg-teal-100 text-teal-900 md:pt-40 md:pb-28">
      <div className="max-w-7xl mx-auto grid gap-10 items-center md:grid-cols-2">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Get Interview‑Ready with
            <br className="hidden md:inline" />
            <span className="text-teal-600">AI‑Powered Practice &amp; Feedback</span>
          </h1>
          <p className="max-w-xl text-lg mb-10">
            Practice real technical interview questions, receive instant feedback, and boost your confidence — all in one place.
          </p>

          <div className="flex gap-4 flex-wrap">
            <FancyButton href="/interview">Start an Interview</FancyButton>
            <GhostButton href="#workflow">See How It Works</GhostButton>
          </div>
        </div>

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

function FancyButton({ href, children }: ButtonProps) {

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!auth?.currentUser) {
      e.preventDefault();
      toast.error('Log in to generate an interview!');
      return;
    }
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
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
