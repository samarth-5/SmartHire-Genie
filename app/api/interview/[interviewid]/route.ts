import { NextRequest, NextResponse } from "next/server";
import { db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";

export async function GET(
  request: NextRequest,
  { params }: { params: { interviewid: string } }
) {
  try {
    const { interviewid } = params;
    if (!interviewid) {
      return NextResponse.json(
        { success: false, error: "Missing interviewid" },
        { status: 400 }
      );
    }

    const docRef = doc(db, "interviews", interviewid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json(
        { success: false, error: "Interview not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, interview: docSnap.data() });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}
