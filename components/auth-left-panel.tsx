'use client';

import React from 'react';

interface AuthLeftPanelProps {
  termsText?: React.ReactNode;
}

export const AuthLeftPanel: React.FC<AuthLeftPanelProps> = ({
  termsText = (
    <>
      Your data and task activities are protected under our
      <br />
      privacy and security standards.
    </>
  ),
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <div style={{ flex: 0.8 }} className="hidden lg:flex relative rounded-[32px] overflow-hidden min-h-full shadow-[0_12px_30px_rgba(0,0,0,0.08)] select-none">
      {/* Background Image */}
      <img
        src="/assets/images/left-side.jpg"
        alt="Task illustration"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark Overlay for contrast */}
      <div className="absolute inset-0 bg-linear-to-b from-black/75 via-black/30 to-black/80 z-1" />

      {/* Top Overlay Content */}
      <div className="absolute top-16 left-12 z-2 text-white max-w-[80%] space-y-4">
        {/* White brand logo icon only */}
        <div className="flex items-center">
          <img
            src="/assets/images/SVG/white.svg"
            alt="ApexFlow logo"
            className="h-8 w-auto drop-shadow-[0_8px_18px_rgba(0,0,0,0.35)]"
          />
        </div>

        <p className="text-[14px] xl:text-[15px] leading-relaxed font-normal opacity-95">
          A Next-Generation Team Workflow Platform Built to Power
          <br />
          High-Efficiency Collaboration, Adaptive Task Workflows,
          <br />
          and Data-Driven Operational Excellence
        </p>
      </div>

      {/* Bottom Overlay Content */}
      <div className="absolute bottom-0 inset-x-0 p-10 z-2 flex flex-col gap-5">
        <div className="text-center">
          <p className="text-white text-[13px] sm:text-[14px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
            {termsText}
          </p>
        </div>

        <div className="flex justify-between items-center text-white text-[13px] sm:text-[14px]">
          <span className="opacity-80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
            All rights reserved © {currentYear}
          </span>
          <span className="font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
            ApexFlow {currentYear}
          </span>
        </div>
      </div>
    </div>
  );
};
