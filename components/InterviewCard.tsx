"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

type InterviewCardProps = {
  company: string;
  role: string;
  level: string;
  type: string;
  techstack: string[];
  coverImage: {
    blurDataURL?: string | null;
    blurHeight?: number;
    blurWidth?: number;
    height: number;
    width: number;
    src: string;
  };
  taken: boolean;
};

export default function InterviewCard({
  company,
  role,
  level,
  type,
  techstack,
  coverImage,
  taken,
}: InterviewCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl shadow-lg p-5 transition-all duration-300",
        taken ? "bg-teal-200" : "bg-teal-100",
        "hover:bg-teal-300 hover:scale-[1.015]"
      )}
    >
      <h2 className="text-teal-900 font-bold text-xl mb-1">{company}</h2>
      <p className="text-teal-800 font-medium">{role}</p>
      <p className="text-sm text-teal-700 mb-3">{level} • {type}</p>

      <div className="w-full h-32 relative rounded-md overflow-hidden mb-4">
        <Image
          src={coverImage?.src || "/placeholder.png"}
          alt={`${company} logo`}
          fill
          className="object-contain"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {techstack.map((tech, idx) => (
          <span
            key={idx}
            className="bg-white text-teal-800 text-xs font-semibold px-3 py-1 rounded-full shadow-sm"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
