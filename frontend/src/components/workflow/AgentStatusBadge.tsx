import React from 'react';
import { AgentStatusType } from '../../types';

interface AgentStatusBadgeProps {
  status: AgentStatusType;
  label?: string;
  size?: 'sm' | 'md';
  accentColor?: string;
}

export const AgentStatusBadge: React.FC<AgentStatusBadgeProps> = ({
  status,
  label,
  size = 'sm',
  accentColor = '#7A96C0',
}) => {
  const getDefaultLabel = () => {
    switch (status) {
      case 'active': return 'Active';
      case 'processing': return 'Processing';
      case 'composing': return 'Composing';
      case 'finalizing':
      case 'ready': return 'Finalizing';
      case 'paused': return 'Paused';
      case 'idle':
      default: return 'Idle';
    }
  };

  const displayLabel = label || getDefaultLabel();

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider rounded border ${
        size === 'sm' ? 'px-1.5 py-0.5 text-[8.5px]' : 'px-2 py-0.5 text-[9.5px]'
      }`}
      style={{
        backgroundColor: `${accentColor}18`,
        borderColor: `${accentColor}40`,
        color: accentColor,
      }}
    >
      <span 
        className="w-1.5 h-1.5 rounded-full" 
        style={{ backgroundColor: accentColor }}
      />
      <span className="font-semibold">{displayLabel}</span>
    </span>
  );
};
export default AgentStatusBadge;
