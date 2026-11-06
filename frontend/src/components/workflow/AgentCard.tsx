import React from 'react';
import { AgentData } from '../../types';
import { AgentHeader } from './AgentHeader';
import { BusinessResearchContent } from './cards/BusinessResearchContent';
import { AnalysisContent } from './cards/AnalysisContent';
import { SalesWritingContent } from './cards/SalesWritingContent';
import { OperationsContent } from './cards/OperationsContent';

interface AgentCardProps {
  agent: AgentData;
  isSelected: boolean;
  onSelect: () => void;
  onOpenDetails: () => void;
  onDispatch?: () => void;
}

export const AgentCard: React.FC<AgentCardProps> = ({
  agent,
  isSelected,
  onSelect,
  onOpenDetails,
  onDispatch,
}) => {
  const accent = agent.accentColor || '#7A96C0';

  // Render agent-specific content based on ID
  const renderAgentBody = () => {
    switch (agent.id) {
      case 'research':
        return <BusinessResearchContent agent={agent} />;
      case 'analysis':
        return <AnalysisContent agent={agent} />;
      case 'sales':
        return <SalesWritingContent agent={agent} />;
      case 'operations':
        return <OperationsContent agent={agent} onDispatch={onDispatch} />;
      default:
        return null;
    }
  };

  return (
    <div
      onClick={onSelect}
      id={`agent-card-${agent.id}`}
      className={`relative w-full rounded-lg border transition-all duration-200 cursor-pointer flex flex-col justify-between bg-[rgba(10,14,26,0.78)] backdrop-blur-[10px] ${
        isSelected
          ? 'border-[#FFD98A] ring-2 ring-[#FFD98A]/30 shadow-card-elevated'
          : 'border-[rgba(170,182,208,0.22)] hover:border-[rgba(170,182,208,0.45)] shadow-card-restrained hover:shadow-card-elevated'
      }`}
      style={{
        minHeight: '440px',
      }}
    >
      {/* Input connector anchor port (left) */}
      {agent.order > 1 && (
        <div 
          className="absolute -left-1.5 top-14 w-3 h-3 rounded-full bg-[#0A0E1A] flex items-center justify-center z-10 border-2"
          style={{ borderColor: accent }}
          title="Input Stream Port"
        >
          <div 
            className="w-1 h-1 rounded-full" 
            style={{ backgroundColor: accent }}
          />
        </div>
      )}

      {/* Output connector anchor port (right) */}
      {agent.order < 4 && (
        <div 
          className="absolute -right-1.5 top-14 w-3 h-3 rounded-full bg-[#0A0E1A] flex items-center justify-center z-10 border-2"
          style={{ borderColor: accent }}
          title="Output Stream Port"
        >
          <div 
            className="w-1 h-1 rounded-full" 
            style={{ backgroundColor: accent }}
          />
        </div>
      )}

      {/* Card Header & Body */}
      <div className="p-3 space-y-2 flex-1">
        <AgentHeader
          agent={agent}
          onOpenDetails={onOpenDetails}
        />
        
        {renderAgentBody()}
      </div>

      {/* Card Technical Footer */}
      <div className="px-3 py-2 border-t border-[rgba(170,182,208,0.15)] bg-[rgba(5,8,20,0.6)] rounded-b-lg flex items-center justify-between text-[9px] font-mono text-[#9FB0D4]">
        <div className="flex items-center gap-1.5">
          <span 
            className="w-1.5 h-1.5 rounded-full" 
            style={{ backgroundColor: accent }}
          />
          <span className="text-[#E8EEFF] font-medium">{agent.tokenCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>LATENCY: <strong className="text-[#E8EEFF] font-semibold">{agent.latency}</strong></span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails();
            }}
            className="text-[8px] uppercase tracking-wider font-semibold hover:underline"
            style={{ color: accent }}
          >
            Inspect
          </button>
        </div>
      </div>
    </div>
  );
};
export default AgentCard;
