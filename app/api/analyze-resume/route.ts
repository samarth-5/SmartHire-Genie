// app/api/analyze-resume/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const runtime = 'nodejs';            // ⇢ keep this route off the edge

const MODEL = 'gemini-2.5-pro';
const MAX_CHARS = 20_000;

export async function POST(req: NextRequest) {
  try {
    /* 1️⃣  Read multipart form */
    const formData = await req.formData();
    const file = formData.get('resume') as File | null;
    const jobDescription = (formData.get('jobDescription') as string | null)?.trim();

    if (!file || !jobDescription) {
      return NextResponse.json({ error: 'Missing resume or job description.' }, { status: 400 });
    }

    /* 2️⃣  ⏬  **Dynamic import** so tests inside pdf‑parse never execute */
    const { default: pdfParse } = await import('pdf-parse');

    const buffer = Buffer.from(await file.arrayBuffer());
    const { text: resumeText } = await pdfParse(buffer);

    /* 3️⃣  Gemini prompt */
    const safeResume = resumeText.slice(0, MAX_CHARS);
    const safeJD     = jobDescription.slice(0, MAX_CHARS);

    const systemPrompt = `
Act as:
• an ATS scanner
• a senior technical recruiter
• a career coach

Return STRICT JSON of:
{
  atsScore: number,
  alignmentPercentage: number,
  strengths: string[],
  weaknesses: string[],
  keyAreasToImprove: string[],
  recommendations: string[]
}
Do NOT wrap in markdown.
`;

    const userPrompt = `Resume:\n${safeResume}\n\nJob Description:\n${safeJD}`;

    /* 4️⃣  Gemini call */
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: MODEL });
    const { response } = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: systemPrompt + userPrompt }] }],
    });

    let feedback: unknown = response.text().trim();
    try {
      feedback = JSON.parse(feedback as string);
    } catch { /* leave as raw text if JSON parse fails */ }

    return NextResponse.json({ feedback });
  } catch (err) {
    console.error('analyze‑resume error:', err);
    return NextResponse.json({ error: 'Resume analysis failed. Please try again.' }, { status: 500 });
  }
}
