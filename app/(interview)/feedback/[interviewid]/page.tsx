'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Feedback, InterviewCardProps } from "@/types";
import { AuthGuard } from "@/firebase/AuthGuard";
import Footer from "@/components/Footer";

export default function FeedbackPage() {
  const { interviewid } = useParams();
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [interview, setInterview] = useState<InterviewCardProps | null>(null);

  useEffect(() => {
    if (!interviewid) return;

    fetch(`/api/feedback/${interviewid}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.feedback) setFeedback(data.feedback);
      });

    fetch(`/api/interview/${interviewid}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.interview) setInterview(data.interview);
      });
  }, [interviewid]);

  if (!feedback || !interview)
    return (
      <div className="w-full h-screen flex items-center justify-center bg-teal-100">
        <div className="text-teal-700 text-xl font-semibold">Loading...</div>
      </div>
    );

  return (
    <AuthGuard>
    <div className="min-h-screen bg-teal-100 py-6 px-2 sm:px-4 mt-16">
      <div className="max-w-4xl mx-auto bg-teal-200 shadow-xl rounded-2xl flex flex-col sm:flex-row items-center gap-4 sm:gap-8 p-4 sm:p-8 mb-4">
        <div className="shrink-0 flex justify-center w-full sm:w-auto">
          <Image
            src={interview.coverImage?.src || "/placeholder.svg"}
            alt={`${interview.company} Logo`}
            width={100}
            height={100}
            className="rounded-lg bg-teal-200 shadow object-contain"
          />
        </div>

        <div className="flex-1 w-full flex flex-col items-center sm:items-start">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-teal-900 mb-2 text-center sm:text-left">
            Feedback: <span className="text-teal-800">{interview.company}</span>
          </h1>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-2 mb-2">
            {interview.level && (
              <span className="bg-teal-700 text-white font-medium px-3 py-1 rounded-full text-sm sm:text-base shadow">
                {interview.level}
              </span>
            )}
            <span className="bg-teal-100 text-teal-900 font-semibold px-3 py-1 rounded-full border border-teal-300 text-sm sm:text-base">
              {interview.type}
            </span>
          </div>
          {interview.techstack?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2 justify-center sm:justify-start">
              {interview.techstack.map((t, i) => (
                <span
                  key={i}
                  className="inline-block bg-teal-100 text-teal-800 px-2 py-0.5 rounded text-xs sm:text-sm font-medium"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
          <div className="text-teal-700 text-sm sm:text-base font-medium mt-1 text-center sm:text-left w-full">
            Interviewed on {new Date(feedback.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-teal-200/95 shadow rounded-2xl p-4 sm:p-8 text-base sm:text-lg">
        <h2 className="text-lg sm:text-2xl font-bold text-teal-800 mb-4">
          Overall Score:{" "}
          <span className="font-extrabold text-teal-900">
            {feedback.totalScore}
          </span>
        </h2>

        {/* Strengths */}
        <section className="mb-6">
          <h3 className="text-base sm:text-xl font-semibold text-teal-800 mb-2">
            Strengths
          </h3>
          <ul className="list-disc pl-5 sm:pl-6 text-teal-700 space-y-1">
            {feedback.strengths.map((str, idx) => (
              <li key={idx}>{str}</li>
            ))}
          </ul>
        </section>

        {/* Areas for Improvement */}
        <section className="mb-6">
          <h3 className="text-base sm:text-xl font-semibold text-teal-800 mb-2">
            Areas for Improvement
          </h3>
          <ul className="list-disc pl-5 sm:pl-6 text-teal-700 space-y-1">
            {feedback.areasForImprovement.map((area, idx) => (
              <li key={idx}>{area}</li>
            ))}
          </ul>
        </section>

        {/* Category Scores */}
        <section className="mb-6">
          <h3 className="text-base sm:text-xl font-semibold text-teal-800 mb-2">
            Category Scores
          </h3>
          <ul className="space-y-3">
            {feedback.categoryScores.map((cat, idx) => (
              <li key={idx} className="rounded-lg bg-teal-100 px-3 py-2">
                <div className="font-bold text-teal-900">{cat.name}</div>
                <div className="text-sm text-teal-700">
                  Score: {cat.score}/100
                </div>
                <div className="italic text-teal-800">{cat.comment}</div>
              </li>
            ))}
          </ul>
        </section>

        {/* Final Assessment */}
        <section>
          <h3 className="text-base sm:text-xl font-semibold text-teal-800 mb-2">
            Final Assessment
          </h3>
          <p className="text-teal-700 teal-200space-pre-line">
            {feedback.finalAssessment}
          </p>
        </section>
      </div>
    </div>
    <Footer />
    </AuthGuard>
  );
}
