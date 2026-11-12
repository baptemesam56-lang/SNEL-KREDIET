import React from 'react';

interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'light',
  size = 'md',
  showSubtitle = true,
}) => {
  const isLightText = variant === 'light';

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const titleSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const subtitleSizes = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-xs',
  };

  return (
    <div className="flex items-center gap-2.5 sm:gap-3 group">
      {/* Bespoke Geometric Financial Emblem */}
      <div
        className={`${iconSizes[size]} relative rounded-xl flex items-center justify-center shrink-0 shadow-md transition-transform duration-300 group-hover:scale-105`}
        style={{
          background: 'linear-gradient(135deg, #0F4C81 0%, #1A62A0 55%, #0B355A 100%)',
          boxShadow: '0 4px 12px rgba(15, 76, 129, 0.25)',
        }}
      >
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full p-1.5"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="sk-crest-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="60%" stopColor="#60A5FA" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
            <linearGradient id="sk-arrow-grad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0F4C81" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
          </defs>

          {/* Shield Outline with rounded corners */}
          <path
            d="M20 4L7 9V19C7 27.5 12.5 35 20 37C27.5 35 33 27.5 33 19V9L20 4Z"
            stroke="url(#sk-crest-grad)"
            strokeWidth="2"
            strokeLinejoin="round"
            fill="rgba(15, 76, 129, 0.35)"
          />

          {/* Modern Stylized Dynamic 'S' & Financial Growth Vector */}
          <path
            d="M25 14C23.5 12.5 21 12 18.5 12.5C15.5 13.1 14 15.2 14 17.5C14 21 26 19.5 26 24C26 27 23.5 28.5 20 28.5C16.5 28.5 14 27 13 25.5"
            stroke="#FFFFFF"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Upward Momentum Vector Peak (Dot of confidence / growth) */}
          <circle cx="27" cy="13" r="2" fill="#F59E0B" />

          {/* Trust center accent */}
          <path
            d="M20 18L22 22H18L20 18Z"
            fill="url(#sk-arrow-grad)"
            opacity="0.9"
          />
        </svg>
      </div>

      {/* Typography Lockup */}
      <div className="flex flex-col text-left leading-tight">
        <div className={`font-extrabold tracking-tight ${titleSizes[size]} font-display flex items-center gap-1.5`}>
          <span className={isLightText ? 'text-white' : 'text-slate-900'}>
            SNEL
          </span>
          <span className={isLightText ? 'text-sky-300 font-black' : 'text-[#0F4C81] font-black'}>
            KREDIET
          </span>
        </div>
        {showSubtitle && (
          <span
            className={`${subtitleSizes[size]} uppercase tracking-widest font-semibold ${
              isLightText ? 'text-slate-300' : 'text-slate-500'
            }`}
          >
            Financiële Diensten België
          </span>
        )}
      </div>
    </div>
  );
};
