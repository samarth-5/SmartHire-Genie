/* =========================================
   components/InterviewCard.tsx
   ========================================= */
   "use client";

   import Image from "next/image";
   import Link from "next/link";
   import { cn } from "@/lib/utils";
   
   export type InterviewCardProps = {
     company: string;
     role: string;
     /** e.g. “Technical”, “Behavioural” */
     type: string;
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
         <div className="rounded-[1.4rem] bg-teal-100/70 p-6 backdrop-blur-sm">
           <span className="absolute top-3 right-3 z-10 rounded-full bg-teal-700/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-sm">
             {type}
           </span>
   
           <div className="relative mb-4 h-28 w-full overflow-hidden rounded-lg bg-teal-50">
             <Image
               src={coverImage?.src || "/placeholder.png"}
               alt={`${company} logo`}
               fill
               className="object-contain"
               sizes="(max-width:768px) 100vw, 33vw"
               priority={false}
             />
           </div>
   
           <h2 className="text-teal-900 font-bold text-lg sm:text-xl mb-0.5">
             {company}
           </h2>
           <p className="text-teal-800 font-medium mb-3">{role}</p>
   
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
   