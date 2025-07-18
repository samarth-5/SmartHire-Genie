"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { vapi } from "@/lib/vapi.sdk";
import useCurrentUser from "@/firebase/currentUser";
import { cn } from "@/lib/utils";
import { interviewerAssistant } from "@/app/api/vapi/interviewer-assistant";
import { createFeedback } from "@/lib/interview";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

interface AgentProps {
  userName: string;
  userId: string;
  interviewId: string;
  feedbackId?: string;
  type: "interview" | "generate";
  questions?: string[];
}

export default function Agent({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions = [],
}: AgentProps) {
  const router = useRouter();
  const user = useCurrentUser();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [microphoneAllowed, setMicrophoneAllowed] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [feedbackProcessing, setFeedbackProcessing] = useState(false);
  const messagesRef = useRef<SavedMessage[]>([]);

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
      setMicrophoneAllowed(true);
    };
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED);
    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);
    const onMessage = (msg: any) => {
      if (msg.type === "transcript" && msg.transcriptType === "final") {
        const newMessage = { role: msg.role, content: msg.transcript };
        messagesRef.current = [...messagesRef.current, newMessage];
        setMessages(prev => [...prev, newMessage]);
      }
    };
    const onError = (err: unknown) => setFeedbackError("Call error: " + String(err));
    const onStartFailed = (e: unknown) => {
      setCallStatus(CallStatus.INACTIVE);
      setFeedbackError("Failed to start call");
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("message", onMessage);
    vapi.on("error", onError);
    vapi.on("call-start-failed", onStartFailed);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("message", onMessage);
      vapi.off("error", onError);
      vapi.off("call-start-failed", onStartFailed);
    };
  }, []);

  useEffect(() => {
    const handleGenerateFeedback = async () => {
      if (feedbackProcessing) return;
      if (!interviewId || !userId) {
        setFeedbackError("Missing interview or user information");
        return;
      }
      const messagesToUse = messagesRef.current;
      if (!messagesToUse || messagesToUse.length === 0) {
        setFeedbackError("No conversation recorded - cannot generate feedback");
        return;
      }
      setFeedbackProcessing(true);
      try {
        const result = await createFeedback({
          interviewId,
          userId,
          transcript: messagesToUse,
          feedbackId,
        });

        if (result.success) {
          if (interviewId) {
            const interviewRef = doc(db, "interviews", interviewId);
            await updateDoc(interviewRef, { 
              taken: true,
              finalized: true,
              completedAt: new Date().toISOString()
            });
          }
          console.log("=== GENERATED FEEDBACK ===");
          console.log(JSON.stringify(result.feedback, null, 2));
          router.push("/dashboard");
        } else {
          setFeedbackError(result.error ?? "Feedback creation failed");
        }
      } catch (error) {
        setFeedbackError("Unexpected error: " + (error instanceof Error ? error.message : String(error)));
      } finally {
        setFeedbackProcessing(false);
      }
    };

    if (callStatus === CallStatus.FINISHED && !feedbackProcessing) {
      if (type === "generate") {
        router.push("/dashboard");
      } else {
        setTimeout(handleGenerateFeedback, 1500);
      }
    }
    // eslint-disable-next-line
  }, [callStatus, router, type, interviewId, userId, feedbackId, feedbackProcessing]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);
    setFeedbackError(null);
    try {
      if (type === "generate") {
        await vapi.start(
          undefined,
          undefined,
          undefined,
          process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!,
          {
            variableValues: {
              username: userName,
              userid: userId ?? "anonymous",
            },
          }
        );
      } else {
        let formattedQuestions = questions.map(q => `- ${q}`).join("\n");
        await vapi.start(interviewerAssistant, {
          variableValues: { questions: formattedQuestions },
        });
      }
    } catch (err) {
      setCallStatus(CallStatus.INACTIVE);
      setFeedbackError("Failed to start call");
    }
  };

  const handleDisconnect = () => {
    vapi.stop();
    setCallStatus(CallStatus.FINISHED);
  };

  const latestMessage = messages[messages.length - 1]?.content;
  const fallbackSvg = useMemo(() => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200" fill="none">
        <rect width="200" height="200" rx="100" fill="#E0F2F1"/>
        <circle cx="100" cy="70" r="44" fill="#FFECB3"/>
        <path d="M56 183a44 44 0 0 1 88 0H56Z" fill="#FFF"/>
        <path d="M30 183c4-48 29-75 70-75s66 27 70 75H30Z" fill="#00695C"/>
        <path d="M95 108h10v40l-5 10-5-10v-40Z" fill="#D32F2F"/>
      </svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }, []);
  const photoSrc = user?.photoURL || fallbackSvg;

  return (
    <>
      <section className="flex flex-col items-center justify-center gap-8 bg-teal-100 py-8 px-4 sm:flex-row sm:gap-18 sm:px-5">
        <article className="relative flex w-full max-w-[500px] flex-col items-center rounded-3xl border border-teal-500 bg-teal-300 px-4 py-8 sm:p-10 text-teal-800 shadow-2xl transition-transform hover:scale-105">
          <div className="relative mb-7">
            <Image
              src="/robot.png"
              alt="AI Interviewer avatar"
              width={200}
              height={200}
              className="size-[200px] rounded-full border-2 border-teal-600 object-cover"
              priority
            />
            {isSpeaking && (
              <span className="absolute right-3 top-3 h-4 w-4 animate-ping rounded-full bg-green-400" />
            )}
          </div>
          <h3 className="text-3xl font-extrabold tracking-wide">Genie</h3>
        </article>

        <article className="relative hidden w-full max-w-[500px] flex-col items-center rounded-3xl border border-teal-500 bg-teal-200 px-4 py-8 sm:flex sm:p-10 text-teal-700 shadow-2xl transition-transform hover:scale-105">
          <div className="relative mb-7">
            <Image
              src={photoSrc}
              alt="Candidate avatar"
              width={200}
              height={200}
              className="size-[200px] rounded-full border-2 border-teal-600 object-cover"
              priority
            />
          </div>
          <h3 className="text-3xl font-extrabold tracking-wide">
            {user?.displayName ?? "Anonymous"}
          </h3>
        </article>
      </section>

      {latestMessage && (
        <div className="flex w-full justify-center px-4">
          <div className="w-full sm:max-w-md px-6 py-2 bg-teal-200/80 backdrop-blur-sm border-2 border-teal-500 rounded-xl shadow-lg text-center text-lg font-medium text-teal-900">
            {latestMessage}
          </div>
        </div>
      )}

      {feedbackError && (
        <div className="flex w-full justify-center px-4 mt-4">
          <div className="w-full sm:max-w-md px-6 py-2 bg-red-100 border-2 border-red-500 rounded-xl text-center text-red-700">
            Error: {feedbackError}
          </div>
        </div>
      )}

      {feedbackProcessing && (
        <div className="flex w-full justify-center px-4 mt-4">
          <div className="w-full sm:max-w-md px-6 py-2 bg-blue-100 border-2 border-blue-500 rounded-xl text-center text-blue-700">
            Generating feedback...
          </div>
        </div>
      )}

      <div className="flex w-full justify-center mt-6">
        {callStatus !== CallStatus.ACTIVE ? (
          <button
            onClick={handleCall}
            type="button"
            aria-label={callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED ? "Start Call" : "Connecting"}
            disabled={callStatus === CallStatus.CONNECTING || feedbackProcessing}
            className={cn(
              "relative px-6 py-3 rounded-full bg-teal-400 text-white font-semibold",
              "flex items-center justify-center gap-2",
              "hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500",
              "active:scale-95 transition disabled:opacity-60 disabled:pointer-events-none"
            )}
          >
            {callStatus === CallStatus.CONNECTING && !microphoneAllowed && (
              <span className="absolute inset-0 flex items-center justify-center animate-ping">
                <span className="h-full w-full rounded-full bg-teal-500 opacity-75" />
              </span>
            )}
            <span className="relative z-[1]">
              {callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED ? "Start\u00A0Call" : ". . ."}
            </span>
          </button>
        ) : (
          <button
            onClick={handleDisconnect}
            type="button"
            aria-label="End Call"
            className="px-6 py-3 rounded-full bg-red-500 text-white font-semibold flex items-center gap-2 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 active:scale-95 transition"
          >
            End Call
          </button>
        )}
      </div>
    </>
  );
}
