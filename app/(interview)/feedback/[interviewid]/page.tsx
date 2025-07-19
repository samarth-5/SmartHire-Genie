"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function page() {
  const params = useParams();
  const interviewid = typeof params.interviewid === 'string' ? params.interviewid : params.interviewid?.[0];
  const [feedback, setFeedback] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!interviewid) return;
    fetch(`/api/feedback/${interviewid}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          setError(data.error);
        } else {
          setFeedback(data.feedback);
        }
        setLoading(false);
        console.log("API Response:", data); // print to console
      })
      .catch(() => {
        setError("Failed to fetch feedback.");
        setLoading(false);
      });
  }, [interviewid]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!feedback) return <div>No feedback found.</div>;

  return (
    <div>
      <h1>Feedback for Interview {interviewid}</h1>
      <pre>{JSON.stringify(feedback, null, 2)}</pre>
    </div>
  );
}
