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

export default function Agent({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions,
}: AgentProps) {
  const router = useRouter();
  const user = useCurrentUser();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [microphoneAllowed, setMicrophoneAllowed] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null); // Added error state
  const messagesRef = useRef<SavedMessage[]>([]);

  useEffect(() => {
    const onCallStart = () => {
      console.log("Call started");
      setCallStatus(CallStatus.ACTIVE);
      setMicrophoneAllowed(true);
    };

    const onCallEnd = () => {
      console.log("Call ended");
      setCallStatus(CallStatus.FINISHED);
    };

    const onSpeechStart = () => {
      console.log("Speech started");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("Speech ended");
      setIsSpeaking(false);
    };

    const onMessage = (msg: any) => {
      if (msg.type === "transcript" && msg.transcriptType === "final") {
        console.log("New message:", msg);
        const newMessage = { role: msg.role, content: msg.transcript };
        messagesRef.current = [...messagesRef.current, newMessage];
        setMessages(prev => [...prev, newMessage]);
      }
    };

    const onError = (err: unknown) => console.error("Vapi Error:", err);
    const onStartFailed = (e: unknown) => console.error("call-start-failed ⇒", e);

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

  // FIXED: Improved feedback generation with better error handling
  useEffect(() => {
    const handleGenerateFeedback = async () => {
      if (!interviewId || !userId) {
        console.error("Missing required parameters");
        router.push("/dashboard");
        return;
      }

      const messagesToUse = messagesRef.current;
      console.log("Generating feedback with messages:", messagesToUse);

      if (!messagesToUse.length) {
        console.log("No messages to generate feedback from");
        setFeedbackError("No conversation recorded - cannot generate feedback");
        router.push("/dashboard");
        return;
      }

      try {
        console.log("Creating feedback with params:", {
          interviewId,
          userId,
          transcript: messagesToUse,
          feedbackId
        });

        const result = await createFeedback({
          interviewId,
          userId,
          transcript: messagesToUse,
          feedbackId,
        });

        console.log("Feedback creation result:", result);

        if (result.success) {
          if (result.feedbackId && interviewId) {
            console.log("Feedback created successfully, updating interview");
            const interviewRef = doc(db, "interviews", interviewId);
            await updateDoc(interviewRef, { taken: true });
          } else {
            console.error("Feedback creation returned no ID");
            setFeedbackError("Feedback created but no ID returned");
          }
        } else {
          const errorMsg = result.error || "Feedback creation failed";
          console.error("Feedback creation failed:", errorMsg);
          setFeedbackError(errorMsg);
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Unknown error";
        console.error("Error in feedback generation:", errorMsg);
        setFeedbackError(errorMsg);
      } finally {
        router.push("/dashboard");
      }
    };

    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        router.push("/dashboard");
      } else {
        // Use a promise to ensure we wait before generating feedback
        new Promise(resolve => setTimeout(resolve, 1500))
          .then(handleGenerateFeedback)
          .catch(error => {
            console.error("Feedback timeout error:", error);
            setFeedbackError("Feedback generation timed out");
          });
      }
    }
  }, [callStatus, router, type, interviewId, userId, feedbackId]);

  // FIXED: Improved call start with better logging
  const handleCall = async () => {
    console.log("Starting call...");
    setCallStatus(CallStatus.CONNECTING);
    try {
      if (type === "generate") {
        console.log("Starting workflow with ID:", process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID);
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
        let formattedQuestions = "";
        if (questions) {
          formattedQuestions = questions.map(q => `- ${q}`).join("\n");
        }
        console.log("Starting assistant with questions:", formattedQuestions);
        await vapi.start(interviewerAssistant, {
          variableValues: { questions: formattedQuestions },
        });
      }
    } catch (err) {
      console.error("Failed to start Vapi:", err);
      setCallStatus(CallStatus.INACTIVE);
    }
  };

  // FIXED: Improved disconnect with immediate status update
  const handleDisconnect = () => {
    console.log("Disconnecting call...");
    vapi.stop();
    // Immediately set status to FINISHED
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

      {/* Added error display */}
      {feedbackError && (
        <div className="flex w-full justify-center px-4 mt-4">
          <div className="w-full sm:max-w-md px-6 py-2 bg-red-100 border-2 border-red-500 rounded-xl text-center text-red-700">
            Error: {feedbackError}
          </div>
        </div>
      )}

      <div className="flex w-full justify-center mt-6">
        {callStatus !== CallStatus.ACTIVE ? (
          <button
            onClick={handleCall}
            type="button"
            aria-label={callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED ? "Start Call" : "Connecting"}
            disabled={callStatus === CallStatus.CONNECTING}
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