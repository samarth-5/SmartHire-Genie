"use client";

import Image from "next/image";
import React, { useState } from "react";

interface AgentProps {
  userName: string;
  userId: string;
  type?: "interviewer" | "candidate" | (string & {});
}

export default function Agent({ userName, userId, type }: AgentProps) {
  const [isSpeaking, setIsSpeaking] = useState(true);

  return (
    <section className="flex flex-col items-center justify-center gap-18 bg-teal-100 py-14 sm:flex-row">
      {/* ── AI Interviewer ───────────────────────────── */}
      <article className="relative flex w-[500px] flex-col items-center rounded-3xl bg-teal-300 p-10 text-teal-800 shadow-2xl transition-transform hover:scale-105">
        <div className="relative mb-7">
          <Image
            src="/robot.png"
            alt="AI Interviewer avatar"
            width={200}
            height={200}
            className="size-[200px] rounded-full border-4 border-teal-600 object-cover"
          />
          {isSpeaking && (
            <span className="animate-speak" />
          )}
        </div>
        <h3 className="text-3xl font-extrabold tracking-wide">Genie</h3>
      </article>

      {/* ── Candidate ──────────────────────────────── */}
      <article className="relative flex w-[500px] flex-col items-center rounded-3xl bg-teal-200 p-10 text-teal-700 shadow-2xl transition-transform hover:scale-105">
        <div className="relative mb-7">
          <Image
            src="/user-avatar.png"
            alt="Candidate avatar"
            width={200}
            height={200}
            className="size-[200px] rounded-full object-cover"
          />
        </div>
        <h3 className="text-3xl font-extrabold tracking-wide">{userName}</h3>
      </article>
    </section>
  );
}
