import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  variant?: 'full' | 'icon' | 'badge';
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md', 
  showSubtitle = true,
  variant = 'full'
}) => {
  // Dimensions
  const dimensions = {
    sm: { icon: 'h-8 w-8', text: 'text-lg', badgeH: 'h-8 px-2.5', fontSize: 'text-xs' },
    md: { icon: 'h-10 w-10', text: 'text-2xl', badgeH: 'h-10 px-3', fontSize: 'text-sm' },
    lg: { icon: 'h-12 w-12', text: 'text-3xl', badgeH: 'h-12 px-4', fontSize: 'text-base' },
    xl: { icon: 'h-16 w-16', text: 'text-4xl', badgeH: 'h-16 px-6', fontSize: 'text-xl' },
  }[size];

  // If user wants the exact square badge as in the uploaded logo
  if (variant === 'badge') {
    return (
      <div 
        className={`bg-black text-white flex items-center justify-center rounded-sm font-serif-display font-semibold select-none border border-white/20 shadow-sm ${dimensions.badgeH} ${className}`}
        style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}
      >
        <span className="tracking-tight whitespace-nowrap">ZS-Studios</span>
      </div>
    );
  }

  // Icon only
  if (variant === 'icon') {
    return (
      <div 
        className={`bg-black text-white flex items-center justify-center rounded-sm font-serif-display font-bold select-none border border-white/20 shadow-sm ${dimensions.icon} ${className}`}
        style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}
      >
        <span className="tracking-tight text-sm">ZS</span>
      </div>
    );
  }

  // Full Lockup with Exact Logo Emblem + Typography
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Black Square Badge with Exact ZS-Studios Styling */}
      <div 
        className={`bg-black text-white flex items-center justify-center rounded-sm font-serif-display font-bold border border-white/20 shadow-sm px-2.5 ${dimensions.icon}`}
        style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}
      >
        <span className="tracking-tighter font-semibold text-xs sm:text-sm">ZS</span>
      </div>

      <div className="flex flex-col">
        <span 
          className={`font-serif-display ${dimensions.text} font-bold tracking-normal leading-none`}
          style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}
        >
          ZS-Studios
        </span>
        {showSubtitle && (
          <span className="text-[10px] tracking-[0.25em] uppercase text-stone-400 dark:text-slate-400 font-sans mt-0.5">
            Real Estate & Prime Sales
          </span>
        )}
      </div>
    </div>
  );
};
