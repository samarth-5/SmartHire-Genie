   'use client';

   import React, { useEffect, useState } from 'react';
   import Image from 'next/image';
   import { useRouter } from 'next/navigation';
   
   import Agent from '@/components/Agent';
   import useCurrentUser from '@/firebase/currentUser';
   import { getInterviewById } from '@/lib/interview';
import { AuthGuard } from '@/firebase/AuthGuard';
import { InterviewCardProps, RouteParams } from '@/types';
   
   export default function InterviewPage({ params }: RouteParams) {
     const { id } = React.use(params);         
   
     const router = useRouter();
   
     const user = useCurrentUser();
   
     const [interview, setInterview] = useState<InterviewCardProps | null>(null);
   
     useEffect(() => {
       (async () => {
         if (!id) return;
         const data = await getInterviewById(id);
         if (!data) 
          router.replace('/dashboard'); 
         else setInterview(data as InterviewCardProps);
       })();
     }, [id, router]);

     console.log(interview);
   
     if (user === null || !interview) {
       return (
         <div className="min-h-screen grid place-items-center bg-teal-100">
           Loading…
         </div>
       );
     }
   
     return (
      <AuthGuard>
       <div className="min-h-screen flex flex-col bg-teal-100 pt-16 lg:pt-17">
         <header className="relative isolate overflow-hidden bg-teal-200 shadow">
           {interview.coverImage?.src && (
             <Image
               src={interview.coverImage.src}
               alt={`${interview.company} cover`}
               fill
               priority
               className="object-cover opacity-20"
             />
           )}
           <div className="absolute inset-0 bg-teal-300/30 backdrop-blur-sm" />
           <div className="relative z-10 mx-auto max-w-5xl px-4 py-8 text-center">
             <h1 className="text-4xl md:text-5xl font-extrabold text-teal-900">
               {interview.company}
             </h1>
             <p className="mt-2 text-xl md:text-2xl font-semibold text-teal-800">
               {interview.role}
             </p>
           </div>
         </header>
   
         <main className="flex-1 px-4 py-10">
           <div className="mx-auto max-w-5xl">
             <Agent
               userName={user.displayName ?? 'User'}
               userId={user.uid}
               interviewId={id}
               type="interview"
               questions={interview.questions}
             />
           </div>
         </main>
       </div>
       </AuthGuard>
     );
   }
   