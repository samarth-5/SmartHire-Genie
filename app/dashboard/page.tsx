"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import InterviewCard from "@/components/InterviewCard";
import { AuthGuard } from "@/firebase/AuthGuard";
import { useAuth } from "@/firebase/AuthContext";
import { db } from "@/firebase/config";
import {
  collection,
  getDocs,
  query,
  where,
  DocumentData,
} from "firebase/firestore";
import Footer from "@/components/Footer";

type Interview = Omit<InterviewCardProps, "coverImage"> & {
  id: string;
  coverImage?: {
    src: string;
  };
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const q = query(
        collection(db, "interviews"),
        where("userId", "==", user.uid)
      );
      const snap = await getDocs(q);

      const data: Interview[] = snap.docs.map((doc) => {
        const d = doc.data() as DocumentData;
        return {
          id: doc.id,
          company: d.company,
          role: d.role,
          level: d.level,
          type: d.type,
          techstack: d.techstack ?? [],
          taken: d.taken ?? false,
          coverImage: d.coverImage ?? { src: "/placeholder.png" },
        };
      });

      setInterviews(data);
      setLoading(false);
    };

    fetchData();
  }, [user]);

  const { finished, upcoming } = useMemo(() => {
    const done = interviews.filter((iv) => iv.taken);
    const up = interviews.filter((iv) => !iv.taken);
    return { finished: done, upcoming: up };
  }, [interviews]);

  return (
    <AuthGuard>
      <main className="min-h-screen bg-teal-100 text-teal-800 px-4 py-20 mt-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-10">
          {/* ===== TOP ACTION CARDS ===== */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <section className="flex flex-col gap-5 rounded-2xl border border-teal-300 bg-teal-200/70 backdrop-blur p-8 shadow-lg">
              <header className="flex items-center gap-4">
                <span className="text-4xl">✨</span>
                <h2 className="text-3xl font-extrabold text-teal-900">
                  Boost Your Resume
                </h2>
              </header>
              <p className="leading-relaxed text-teal-700">
                Get an ATS‑friendly resume review &amp; actionable tips to stand out.
                Our AI analyses formatting, keywords, and impact.
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
                <h2 className="text-3xl font-extrabold text-teal-900">
                  Generate Practice Interviews
                </h2>
              </header>
              <p className="text-base leading-relaxed text-teal-700">
                Craft realistic interview sessions tailored to your role. Select
                skills &amp; difficulty for technical and behavioural rounds.
              </p>
              <Link href="/generate-interview" className="self-center md:self-start">
                <button className="hover:cursor-pointer rounded-full border border-teal-500 px-6 py-2.5 text-base font-medium text-teal-700 transition-colors hover:bg-teal-300/50">
                  Generate an Interview
                </button>
              </Link>
            </section>
          </div>

          {/* ===== YOUR INTERVIEWS ===== */}
          <section className="flex flex-col gap-5 rounded-2xl border border-teal-300 bg-teal-200/70 backdrop-blur p-8 shadow-lg">
            <header className="flex items-center gap-4">
              <span className="text-4xl">📄</span>
              <h2 className="text-3xl font-extrabold text-teal-900">
                Your Interviews
              </h2>
            </header>

            {loading ? (
              <p className="text-teal-700">Loading…</p>
            ) : finished.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {finished.map((interview) => (
                  <InterviewCard
                  key={interview.id}
                  interviewId={interview.id}
                  company={interview.company}
                  role={interview.role}
                  type={interview.type}
                  techstack={interview.techstack}
                  coverImage={interview.coverImage}
                  taken={true} />
                ))}
              </div>
            ) : (
              <p className="text-teal-700">
                You haven&apos;t completed any interviews yet. Generate one above to get started!
              </p>
            )}
          </section>

          {/* ===== UPCOMING ===== */}
          <section className="flex flex-col gap-5 rounded-2xl border border-teal-300 bg-teal-200/70 backdrop-blur p-8 shadow-lg">
            <header className="flex items-center gap-4">
              <span className="text-4xl">📅</span>
              <h2 className="text-3xl font-extrabold text-teal-900">
                Upcoming Interviews
              </h2>
            </header>

            {loading ? (
              <p className="text-teal-700">Loading…</p>
            ) : upcoming.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcoming.map((interview) => (
                  <InterviewCard
                  key={interview.id}
                  interviewId={interview.id}
                  company={interview.company}
                  role={interview.role}
                  type={interview.type}
                  techstack={interview.techstack}
                  coverImage={interview.coverImage}
                  taken={false}
                />
                ))}
              </div>
            ) : (
              <p className="text-teal-700">
                No upcoming interviews scheduled. Generate one above!
              </p>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </AuthGuard>
  );
}
