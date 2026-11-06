import React, { useState } from 'react';
import { 
  MoreVertical, 
  Search, 
  Cpu, 
  FileText, 
  ShieldCheck, 
  RefreshCw, 
  ExternalLink, 
  PauseCircle
} from 'lucide-react';
import { AgentData } from '../../types';
import { AgentStatusBadge } from './AgentStatusBadge';
import { ProgressBar } from './ProgressBar';

interface AgentHeaderProps {
  agent: AgentData;
  onOpenDetails: () => void;
  onAction?: (action: string) => void;
}

export const AgentHeader: React.FC<AgentHeaderProps> = ({
  agent,
  onOpenDetails,
  onAction,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const getAgentIcon = (id: string) => {
    switch (id) {
      case 'research': return Search;
      case 'analysis': return Cpu;
      case 'sales': return FileText;
      case 'operations': return ShieldCheck;
      default: return Cpu;
    }
  };

  const IconComponent = getAgentIcon(agent.id);
  const accent = agent.accentColor || '#7A96C0';

  return (
    <div className="border-b border-[rgba(170,182,208,0.18)] pb-2.5">
      {/* Top row: Icon, Name, Status, Three-dot menu */}
      <div className="flex items-start justify-between gap-1.5 mb-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div 
            className="w-7 h-7 rounded flex items-center justify-center shrink-0 border"
            style={{
              backgroundColor: 'rgba(20, 26, 42, 0.7)',
              borderColor: 'rgba(170, 182, 208, 0.25)',
              color: accent,
            }}
          >
            <IconComponent className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <span 
                className="text-[9px] font-mono leading-none font-semibold"
                style={{ color: accent }}
              >
                0{agent.order}
              </span>
              <h3 className="text-[10px] xl:text-[10.5px] font-bold tracking-tight text-[#E8EEFF] uppercase font-mono leading-tight">
                {agent.title}
              </h3>
            </div>
            <p className="text-[8.5px] text-[#9FB0D4] truncate mt-0.5 leading-none font-sans">
              {agent.role}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0 pt-0.5">
          <AgentStatusBadge 
            status={agent.status} 
            label={agent.statusLabel} 
            size="sm" 
            accentColor={accent}
          />

          {/* Three-dot Action Menu */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="p-1 rounded text-[#9FB0D4] hover:text-[#E8EEFF] hover:bg-[#141A2A] transition-colors"
              title="Agent actions"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {menuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-30" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                  }}
                />
                <div className="absolute right-0 top-full mt-1 w-44 rounded-lg bg-[#0A0E1A] border border-[rgba(170,182,208,0.28)] shadow-2xl backdrop-blur-md z-40 py-1 text-[11px] font-mono text-[#E8EEFF]">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                      onOpenDetails();
                    }}
                    className="w-full px-3 py-1.5 text-left text-[#E8EEFF] hover:bg-[#141A2A] flex items-center gap-2"
                  >
                    <ExternalLink className="w-3 h-3 text-[#FFD98A]" />
                    Inspect Agent
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                      onAction?.('restart');
                    }}
                    className="w-full px-3 py-1.5 text-left text-[#E8EEFF] hover:bg-[#141A2A] flex items-center gap-2"
                  >
                    <RefreshCw className="w-3 h-3 text-[#FFD98A]" />
                    Rerun Step
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                      onAction?.('pause');
                    }}
                    className="w-full px-3 py-1.5 text-left text-[#E8EEFF] hover:bg-[#141A2A] flex items-center gap-2"
                  >
                    <PauseCircle className="w-3 h-3 text-[#FFD98A]" />
                    Pause Agent
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-2">
        <ProgressBar progress={agent.progress} size="xs" accentColor={accent} />
      </div>

      {/* Current Activity Banner */}
      <div className="flex items-center justify-between px-2 py-1 rounded bg-[rgba(5,8,20,0.65)] border border-[rgba(170,182,208,0.18)] text-[9px] font-mono">
        <div className="flex items-center gap-1.5 truncate">
          <span 
            className="w-1.5 h-1.5 rounded-full shrink-0" 
            style={{ backgroundColor: accent }}
          />
          <span className="text-[#E8EEFF] font-semibold tracking-wider truncate">
            {agent.currentActivity}
          </span>
        </div>
        <span className="text-[#9FB0D4] shrink-0 ml-1">
          {agent.progress}%
        </span>
      </div>
    </div>
  );
};
export default AgentHeader;
