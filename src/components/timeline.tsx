"use client";

import Image from "next/image";
import React from "react";

const HACKATHON_PHASES = [
  "Participants reach",
  "Ideation",
  "Review 1",
  "Lunch",
  "Speaker Sessions",
  "Review 2",
  "Dinner",
  "Begin Hacking",
  "Final Review",
];

interface TimelineProps {
  currentPhase: string;
}

export default function Timeline({ currentPhase }: TimelineProps) {
  const currentIndex = HACKATHON_PHASES.indexOf(currentPhase);

  return (
    <div className="w-72 bg-[#010027] relative">
      <div className="p-3 border-b-4 border-white">
        <Image
          src="/final-logo.webp"
          alt="Hackulus Logo"
          className="w-[4.85rem] h-[4.5rem]"
        />
      </div>
      <div className="px-6 py-6">
        <h2 className="text-center text-5xl text-white font-bold mb-4 castoro">
          Timeline
        </h2>
        <div className="relative space-y-4">
          {HACKATHON_PHASES.map((phase, index) => {
            const isCurrent = index === currentIndex;
            const isPast = index < currentIndex;

            let style = "bg-white text-[#242e6c]";
            if (isCurrent) {
              style = "bg-[#CF3D00] text-white";
            } else if (isPast) {
              style = "bg-[#CF3D00]/40 text-white/70";
            }

            return (
              <div key={phase} className="relative">
                <div
                  className={`${style} px-4 py-2.5 rounded-lg font-medium text-2xl text-center shadow-lg afacad transition-all duration-300`}
                >
                  {phase}
                </div>
                {index < HACKATHON_PHASES.length - 1 && (
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-4 bg-gray-300 mt-0"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
