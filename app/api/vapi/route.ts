import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import amazon from "@/public/logos/amazon.svg"
import { db } from "@/firebase/config";
import { addDoc, collection } from "firebase/firestore";
//import { getRandomInterviewCover } from "@/lib/utils";

export async function GET() {
  return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
}

export async function POST(request: Request) {
    const { company, role, level, techstack, type, amount, userid } = await request.json();
  
    try {
      const { text: questions } = await generateText({
        model: google("gemini-2.5-pro"),
        prompt: `Prepare questions for a job interview.
          The targetted company is ${company}.
          The job role is ${role}.
          The job experience level is ${level}.
          The tech stack used in the job is: ${techstack}.
          The focus between behavioural and technical questions should lean towards: ${type}.
          The amount of questions required is: ${amount}.
          Please return only the questions, without any additional text and try to provide short questions 1-2 lines max.
          The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
          Return the questions formatted like this:
          ["Question 1", "Question 2", "Question 3"]
          
          Thank you! <3
      `,
      });
  
      const interview = {
        company: company,
        role: role,
        level: level,
        techstack: techstack.split(","),
        type: type,
        questions: JSON.parse(questions),
        userId: userid,
        finalized: true,
        coverImage: amazon,
        createdAt: new Date().toISOString(),
        taken: false
      };
  
      await addDoc(collection(db, "interviews"), interview);
  
      return Response.json({ success: true }, { status: 200 });
    } catch (error) {
      console.error("Error:", error);
      return Response.json({ success: false, error: error }, { status: 500 });
    }
  }