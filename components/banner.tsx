import React from 'react';

interface BannerProps {
  backgroundImage: string;
  title: string;
  description: string;
  actionButton?: {
    text: string;
    onClick: () => void;
  };
}

export const Banner: React.FC<BannerProps> = ({
  backgroundImage,
  title,
  description,
  actionButton,
}) => {
  return (
    <div
      style={{ backgroundImage: `url('${backgroundImage}')` }}
      className="relative rounded-[24px] p-6 sm:p-8 bg-cover bg-center shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex items-center justify-between flex-wrap gap-4 overflow-hidden"
    >
      <div className="absolute inset-0 bg-black/55 z-1" />
      <div className="space-y-1.5 relative z-2 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
        <h2 className="font-extrabold text-[20px] sm:text-[24px] tracking-wide font-sans drop-shadow-md">
          {title}
        </h2>
        <p className="text-[12px] sm:text-[13px] text-white/95 font-sans leading-relaxed whitespace-normal">
          {description}
        </p>
      </div>
      {actionButton && (
        <button
          onClick={actionButton.onClick}
          className="relative z-2 border-2 border-white/80 hover:border-white bg-white/20 hover:bg-white/35 text-white font-bold rounded-full py-2 px-5 text-[14px] cursor-pointer backdrop-blur-sm transition-all shrink-0 outline-none shadow-[0_2px_12px_rgba(0,0,0,0.3)]"
        >
          {actionButton.text}
        </button>
      )}
    </div>
  );
};
