import { NextRequest, NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import z from "zod";
import { db } from "@/firebase/config";
import { doc, setDoc, collection } from "firebase/firestore";

// FIX: Use z.array, not z.tuple
const feedbackSchema = z.object({
  totalScore: z.number(),
  categoryScores: z.array(
    z.object({
      name: z.string(),
      score: z.number(),
      comment: z.string(),
    })
  ),
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
  finalAssessment: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const { interviewId, userId, transcript, feedbackId } = await request.json();
    if (!interviewId || !userId || !Array.isArray(transcript) || transcript.length === 0) {
      return NextResponse.json({
        success: false,
        error: "Missing or invalid parameters"
      }, { status: 400 });
    }

    const formattedTranscript = transcript
      .map((m: { role: string; content: string }) => `${m.role}: ${m.content}`)
      .join("\n");

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return NextResponse.json({
        success: false,
        error: "Server configuration error: missing Google API key"
      }, { status: 500 });
    }

    const model = google("gemini-1.5-flash");

    // In prompt, require specific five categories with correct spelling/case.
    const { object } = await generateObject({
      model,
      schema: feedbackSchema,
      prompt: `
You are a professional software interview coach reviewing the interview transcript below:

${formattedTranscript}

Evaluate the candidate on these EXACT categories (all five must appear in your response):
- Communication Skills
- Technical Knowledge
- Problem Solving
- Cultural Fit
- Confidence and Clarity

For each, include:
- name (as above)
- score (0-100)
- comment

Also, give:
- totalScore (average of all five)
- strengths (array, 2-4)
- areasForImprovement (array, 2-4)
- finalAssessment (string, with recommendation)

Output all category scores as an array of 5 objects. Names must exactly match above.
      `,
      system: "You are a technical interviewer evaluating candidates for software engineering roles.",
    });

    const feedback = {
      interviewId,
      userId,
      totalScore: object.totalScore,
      categoryScores: object.categoryScores,
      strengths: object.strengths,
      areasForImprovement: object.areasForImprovement,
      finalAssessment: object.finalAssessment,
      createdAt: new Date().toISOString(),
    };

    const feedbackRef = doc(db, "feedback", interviewId);
    await setDoc(feedbackRef, feedback);

    await setDoc(feedbackRef, feedback);

    return NextResponse.json({
      success: true,
      feedbackId: feedbackRef.id,
      feedback,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.message ?? "Internal server error",
      details: error?.stack
    }, { status: 500 });
  }
}
