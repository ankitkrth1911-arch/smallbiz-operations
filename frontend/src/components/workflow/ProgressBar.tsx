import React from 'react';

interface ProgressBarProps {
  progress: number;
  showLabel?: boolean;
  size?: 'xs' | 'sm' | 'md';
  accentColor?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  showLabel = false,
  size = 'xs',
  accentColor = '#FFD98A',
}) => {
  const heightClass = {
    xs: 'h-1',
    sm: 'h-1.5',
    md: 'h-2',
  }[size];

  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center text-[10px] font-mono text-[#9FB0D4] mb-1">
          <span>COMPLETION</span>
          <span className="font-semibold text-[#E8EEFF]">{clampedProgress}%</span>
        </div>
      )}
      <div className={`w-full ${heightClass} bg-[rgba(5,8,20,0.8)] border border-[rgba(170,182,208,0.15)] rounded-full overflow-hidden`}>
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ 
            width: `${clampedProgress}%`,
            backgroundColor: accentColor,
          }}
        />
      </div>
    </div>
  );
};
export default ProgressBar;
