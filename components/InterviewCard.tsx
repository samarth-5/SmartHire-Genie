"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
   
export type InterviewCardProps = {
     company: string;
     role: string;
     type: string; // e.g., "Technical"
     techstack: string[];
     coverImage?: {
       src: string;
       height?: number;
       width?: number;
       blurDataURL?: string | null;
       blurHeight?: number;
       blurWidth?: number;
     };
     taken: boolean;
     startHref?: string;
     feedbackHref?: string;
};
   
export default function InterviewCard({
     company,
     role,
     type,
     techstack,
     coverImage,
     taken,
     startHref = "#",
     feedbackHref = "#",
   }: InterviewCardProps) {
     return (
       <div
         className={cn(
           "group relative overflow-hidden rounded-3xl p-[1px] transition-transform duration-300",
           "bg-gradient-to-br from-teal-200 via-teal-100 to-white",
           "hover:-translate-y-1 hover:shadow-xl"
         )}
       >
         <div className="rounded-[1.4rem] bg-teal-100/70 p-6 backdrop-blur-sm relative">
           <span className="absolute top-3 right-3 z-10 rounded-full bg-teal-700/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-sm">
             {type}
           </span>
   
           <div className="flex items-start gap-4 mb-4">
             <div className="relative h-20 w-20 min-w-[5rem] rounded-lg overflow-hidden bg-teal-50">
               <Image
                 src={coverImage?.src || "/placeholder.png"}
                 alt={`${company} logo`}
                 fill
                 className="object-contain"
                 sizes="80px"
               />
             </div>
   
             <div>
               <h2 className="text-teal-900 font-bold text-lg sm:text-xl mb-1">
                 {company}
               </h2>
               <p className="text-teal-800 font-medium">{role}</p>
             </div>
           </div>
   
           <div className="mb-4 flex flex-wrap gap-2">
             {techstack.map((t) => (
               <span
                 key={t}
                 className="rounded-full bg-teal-200 px-3 py-1 text-xs font-semibold text-teal-800 shadow-sm backdrop-blur-md"
               >
                 {t}
               </span>
             ))}
           </div>
   
           {taken ? (
             <Link
               href={feedbackHref}
               className="block rounded-full border border-teal-600 py-2 text-center text-sm font-semibold text-teal-700 transition-colors hover:bg-teal-600 hover:text-white"
             >
               View Feedback
             </Link>
           ) : (
             <Link
               href={startHref}
               className="block rounded-full bg-teal-600 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-teal-700"
             >
               Start Interview
             </Link>
           )}
         </div>
       </div>
     );
   }
   