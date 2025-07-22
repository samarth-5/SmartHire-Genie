import { NextRequest, NextResponse } from "next/server";
import { db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";

export async function GET(
    req: NextRequest,
    { params }: { params: { interviewid: string } }
  ) {
  const { interviewid } = params;

  if (!interviewid) {
    return NextResponse.json({ success: false, error: "Missing interviewid" }, { status: 400 });
  }

  try {
    const docRef = doc(db, "feedback", interviewid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ success: false, error: "Feedback not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, feedback: docSnap.data() });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err?.message ?? "Internal server error"
    }, { status: 500 });
  }
}
