import { ArrowBigDownDash, ArrowRight, BarChart3, Briefcase, Building, ListChecks, Mic, TrendingUp } from 'lucide-react';
import React, { ReactNode } from 'react'

type StepData = {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
  };

export default  function WorkflowSection() {
    return (
      <section id="workflow" className="py-24 px-4 bg-teal-300 text-teal-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">How It Works</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            {steps.map(({ icon: Icon, label }, i) => (
              <React.Fragment key={label}>
                <Step icon={<Icon />} label={label} />
                {i < steps.length - 1 && (
                  <>
                    <ArrowRight className="hidden md:inline-block h-5 w-5 text-teal-700" />
                    <ArrowBigDownDash className="md:hidden h-6 w-6 text-teal-700" />
                  </>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>
    );
  }
  
  function Step({ icon, label }: { icon: ReactNode; label: string }) {
    return (
      <div className="flex flex-col items-center">
        <div className="h-14 w-14 rounded-full border border-teal-600 flex items-center justify-center bg-white">
          <div className="text-teal-700">{icon}</div>
        </div>
        <p className="mt-3 text-sm max-w-[130px] text-center leading-tight">{label}</p>
      </div>
    );
  }

const steps: StepData[] = [
    { icon: Building, label: 'Select Company' },
    { icon: Briefcase, label: 'Choose Position & JD' },
    { icon: ListChecks, label: 'Pick Interview Type' },
    { icon: Mic, label: 'Take the Interview' },
    { icon: BarChart3, label: 'Report + Rating' },
    { icon: TrendingUp, label: 'Improve' },
];