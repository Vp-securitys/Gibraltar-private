import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Logo({ size = 'md', className = '' }: LogoProps) {
  let textSize = 'text-2xl';
  let subTextSize = 'text-sm';
  let gap = 'gap-1';

  if (size === 'sm') {
    textSize = 'text-lg';
    subTextSize = 'text-xs';
    gap = 'gap-0.5';
  } else if (size === 'lg') {
    textSize = 'text-3xl';
    subTextSize = 'text-base';
    gap = 'gap-2';
  }

  return (
    <div className={`flex flex-col ${gap} ${className}`}>
      <div className={`flex items-center font-bold ${textSize} text-black`}>
        <span>Gibraltar</span>
        <span className="ml-1 text-yellow-900">Private</span>
      </div>
      <div className="w-full h-px bg-yellow-900"></div>
      <div className={`font-semibold uppercase tracking-wider ${subTextSize} text-black text-center`}>
        Bank & Trust
      </div>
    </div>
  );
}
