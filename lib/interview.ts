import { db } from "@/firebase/config";         
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { collection, doc, getDoc, setDoc } from "firebase/firestore"; 
import z from "zod";

// Fixed: Use z.array(), not z.tuple()
export const feedbackSchema = z.object({
  totalScore: z.number(),
  categoryScores: z.array(
    z.object({
      name: z.string(), // validation will be enforced in prompt & client logic, not Zod
      score: z.number(),
      comment: z.string(),
    })
  ),
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
  finalAssessment: z.string(),
});

export async function getInterviewById(id: string): Promise<InterviewCardProps | null> {
  try {
    const interviewRef = doc(db, "interviews", id);
    const snap = await getDoc(interviewRef);
    return snap.exists() ? (snap.data() as InterviewCardProps) : null;
  } catch (error) {
    console.error("Error fetching interview:", error);
    return null;
  }
}

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript, feedbackId } = params;

  if (!interviewId || !userId) {
    console.error("Missing required parameters:", { interviewId, userId });
    return { 
      success: false, 
      error: "Missing interviewId or userId" 
    };
  }

  if (!transcript || !Array.isArray(transcript) || transcript.length === 0) {
    console.error("Invalid or empty transcript:", transcript);
    return { 
      success: false, 
      error: "Invalid or empty transcript" 
    };
  }

  try {
    const response = await fetch('/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        interviewId,
        userId,
        transcript,
        feedbackId
      }),
    });

    const responseText = await response.text();

    if (!response.ok) {
      return { 
        success: false, 
        error: `API request failed with status ${response.status}: ${responseText}` 
      };
    }

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      return { 
        success: false, 
        error: "Invalid JSON response from API" 
      };
    }
    return result;

  } catch (error) {
    return { 
      success: false,
      error: error instanceof Error ? error.message : "Network error",
      details: error instanceof Error ? error.stack : String(error)
    };
  }
}
