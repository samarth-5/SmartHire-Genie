import { db } from "@/firebase/config";           // your Firestore instance
import { doc, getDoc } from "firebase/firestore"; // modular helpers

export async function getInterviewById(id: string): Promise<InterviewCardProps | null> 
{
  const interviewRef = doc(db, "interviews", id);
  const snap = await getDoc(interviewRef);
  return snap.exists() ? (snap.data() as InterviewCardProps) : null;
}
