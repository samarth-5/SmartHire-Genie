"use client";

import useCurrentUser from "@/firebase/currentUser";
import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

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

export default function Agent({ type }: AgentProps) {

  const router=useRouter(); 

  const user = useCurrentUser();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  //const [lastMessage, setLastMessage] = useState<string>("");
  
  //console.log(setIsSpeaking);
  //console.log(setCallStatus);
  //console.log(user);
  const userName=user?.displayName;
  const userId=user?.uid;

  //const messages = ["What is your name?", "My name is Genie djkjdf sjkbjsknjb sjbjsbjbsbjs vdsjbvsd!"];
  //const lastMessage = messages[messages.length - 1];

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => {
      console.log("speech start");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("speech end");
      setIsSpeaking(false);
    };

    const onError = (error: Error) => {
      console.log("Error:", error);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  useEffect(() => {
        if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        router.push("/");
      }
    }
  }, [messages, callStatus, router, type, userId]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    if (type === "generate") {
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
        variableValues: {
          username: userName,
          userid: userId,
        },
      });
    } 
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  const latestMessage=messages[messages.length-1]?.content;
  //const isCallInactiveOrFinished=callStatus===CallStatus.INACTIVE || callStatus===CallStatus.FINISHED;

  // ── fallback SVG avatar ──────────────────────────────────────
  const defaultSvgDataUri = useMemo(() => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200" fill="none">
        <rect width="200" height="200" rx="100" fill="#E0F2F1"/>
        <circle cx="100" cy="70" r="44" fill="#FFECB3"/>
        <path d="M56 183a44 44 0 0 1 88 0H56Z" fill="#FFF"/>
        <path d="M30 183c4-48 29-75 70-75s66 27 70 75H30Z" fill="#00695C"/>
        <path d="M95 108h10v40l-5 10-5-10v-40Z" fill="#D32F2F"/>
      </svg>
    `;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }, []);

  const photoSrc = user?.photoURL || defaultSvgDataUri;

  return (
    <>
      <section className="flex flex-col items-center justify-center gap-8 bg-teal-100 py-8 px-4 sm:flex-row sm:gap-18 sm:px-5">
        {/* AI Interviewer */}
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
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3 className="text-3xl font-extrabold tracking-wide">Genie</h3>
        </article>

        {/* Candidate (hidden on mobile) */}
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

      {messages.length > 0 && (
        <div className="flex w-full justify-center px-4">
          <div className="w-full sm:max-w-md px-6 py-2 bg-teal-200/80 backdrop-blur-sm border-2 border-teal-500 rounded-xl shadow-lg text-center text-lg font-medium text-teal-900">
            {latestMessage}
          </div>
        </div>
      )}

      <div className="flex w-full justify-center mt-6">
        {callStatus !== CallStatus.ACTIVE ? (
          <button onClick={handleCall} type="button" aria-label={
              callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED
                ? "Start Call" : "Connecting"}
            className={cn(
              "relative px-6 py-3 rounded-full bg-teal-400 outline-1 outline-teal-600 text-white font-semibold",
              "flex items-center justify-center gap-2",
              "hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500",
              "active:scale-95 transition disabled:opacity-60 disabled:pointer-events-none"
            )}
            disabled={callStatus === CallStatus.CONNECTING}
          >
            <span
              className={cn(
                "absolute inset-0 flex items-center justify-center",
                callStatus === CallStatus.CONNECTING ? "animate-ping" : "hidden"
              )}
            >
              <span className="block h-full w-full rounded-full bg-teal-500 opacity-75" />
            </span>
            <span className="relative z-[1]">
              {callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED
                ? "Start Call"
                : ". . ."}
            </span>
          </button>
        ) : (
          <button onClick={handleDisconnect} type="button" aria-label="End Call"
            className="px-6 py-3 rounded-full bg-red-500 text-white font-semibold flex items-center gap-2 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 active:scale-95 transition">
            End Call
          </button>
        )}
      </div>
    </>
  );
}
