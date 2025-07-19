'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Feedback, InterviewCardProps } from "@/types";

export default function FeedbackPage() {
  const { interviewid } = useParams();
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [interview, setInterview] = useState<InterviewCardProps | null>(null);

  useEffect(() => {
    if (!interviewid) return;
    fetch(`/api/feedback/${interviewid}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.feedback) setFeedback(data.feedback);
      });
      fetch(`/api/interview/${interviewid}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.interview) setInterview(data.interview);
      });
  }, [interviewid]);

  console.log(interview);
  console.log(feedback);

  if (!feedback) return <div>Loading...</div>;

  return (
    <div>
      <h1>Feedback for Interview {feedback.interviewId}</h1>
      <div>
        <strong>Total Score:</strong> {feedback.totalScore}
      </div>
      <div>
        <strong>Areas for Improvement:</strong>
        <ul>
          {feedback.areasForImprovement.map((area, idx) => (
            <li key={idx}>{area}</li>
          ))}
        </ul>
      </div>
      <div>
        <strong>Category Scores:</strong>
        <ul>
          {feedback.categoryScores.map((cat, idx) => (
            <li key={idx}>
              <strong>{cat.name}</strong> ({cat.score}/5):<br />
              <em>{cat.comment}</em>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <strong>Strengths:</strong>
        <ul>
          {feedback.strengths.map((strength, idx) => (
            <li key={idx}>{strength}</li>
          ))}
        </ul>
      </div>
      <div>
        <strong>Final Assessment:</strong>
        <p>{feedback.finalAssessment}</p>
      </div>
      <div>
        <small><strong>Created at:</strong> {feedback.createdAt}</small>
      </div>
    </div>
  );
}
