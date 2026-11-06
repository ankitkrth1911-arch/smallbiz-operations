import React from 'react';
import { 
  X, 
  Cpu, 
  Search, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  Wrench, 
  History, 
  MessageSquare, 
  Zap,
  RotateCcw
} from 'lucide-react';
import { AgentData } from '../../types';
import { AgentStatusBadge } from '../workflow/AgentStatusBadge';
import { ProgressBar } from '../workflow/ProgressBar';

interface AgentDetailPanelProps {
  agent: AgentData | null;
  isOpen: boolean;
  onClose: () => void;
  onTriggerAction?: (action: string) => void;
}

export const AgentDetailPanel: React.FC<AgentDetailPanelProps> = ({
  agent,
  isOpen,
  onClose,
  onTriggerAction,
}) => {
  if (!isOpen || !agent) return null;

  const getAgentIcon = (id: string) => {
    switch (id) {
      case 'research': return Search;
      case 'analysis': return Cpu;
      case 'sales': return FileText;
      case 'operations': return ShieldCheck;
      default: return Cpu;
    }
  };

  const Icon = getAgentIcon(agent.id);
  const accent = agent.accentColor || '#7A96C0';

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#0C1430]/80 backdrop-blur-md animate-fade-in select-none">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
      />

      <div className="relative w-full max-w-lg bg-[rgba(10,14,26,0.88)] backdrop-blur-md border-l border-[rgba(170,182,208,0.22)] h-full flex flex-col shadow-2xl z-10 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[rgba(170,182,208,0.18)] bg-[#141A2A] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-9 h-9 rounded flex items-center justify-center border shrink-0"
              style={{
                backgroundColor: 'rgba(20, 26, 42, 0.7)',
                borderColor: 'rgba(170, 182, 208, 0.25)',
                color: accent,
              }}
            >
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono" style={{ color: accent }}>
                  NODE 0{agent.order}
                </span>
                <h3 className="text-sm font-bold text-[#E8EEFF] font-mono uppercase tracking-wider">
                  {agent.title}
                </h3>
              </div>
              <p className="text-[11px] text-[#9FB0D4] mt-0.5">
                {agent.role}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <AgentStatusBadge status={agent.status} label={agent.statusLabel} accentColor={accent} />
            <button
              onClick={onClose}
              className="p-1 rounded text-[#9FB0D4] hover:text-[#E8EEFF] hover:bg-[#1E2638] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Status & Progress Summary */}
          <div className="p-3 rounded bg-[rgba(20,26,42,0.6)] border border-[rgba(170,182,208,0.18)] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#9FB0D4]">CURRENT TASK</span>
              <span className="text-[#E8EEFF] font-semibold">{agent.currentActivity}</span>
            </div>
            <ProgressBar progress={agent.progress} showLabel size="sm" accentColor={accent} />
            <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono text-[10px]">
              <div className="p-1.5 rounded bg-[#050814] border border-[rgba(170,182,208,0.14)]">
                <div className="text-[#9FB0D4]">THROUGHPUT</div>
                <div className="text-[#E8EEFF] font-semibold mt-0.5">{agent.tokenCount}</div>
              </div>
              <div className="p-1.5 rounded bg-[#050814] border border-[rgba(170,182,208,0.14)]">
                <div className="text-[#9FB0D4]">LATENCY</div>
                <div className="text-[#E8EEFF] font-semibold mt-0.5">{agent.latency}</div>
              </div>
              <div className="p-1.5 rounded bg-[#050814] border border-[rgba(170,182,208,0.14)]">
                <div className="text-[#9FB0D4]">STATUS</div>
                <div className="font-semibold mt-0.5" style={{ color: accent }}>{agent.status.toUpperCase()}</div>
              </div>
            </div>
          </div>

          {/* Assigned Tools / Capabilities */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#E8EEFF] uppercase font-semibold flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5" style={{ color: accent }} /> Assigned Capabilities & Tools
              </span>
              <span className="text-[#9FB0D4] text-[10px]">{agent.tools.length} REGISTERED</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {agent.tools.map((tool, idx) => (
                <div 
                  key={idx}
                  className="p-2 rounded bg-[rgba(20,26,42,0.6)] border border-[rgba(170,182,208,0.18)] flex items-center justify-between text-[11px]"
                >
                  <div className="truncate">
                    <div className="font-medium text-[#E8EEFF] truncate">{tool.name}</div>
                    <div className="text-[9px] font-mono text-[#9FB0D4]">{tool.category}</div>
                  </div>
                  <span 
                    className="w-1.5 h-1.5 rounded-full" 
                    style={{ backgroundColor: tool.status === 'active' ? accent : '#7A96C0' }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Recent Internal Messages / Agent Stream */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#E8EEFF] uppercase font-semibold flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" style={{ color: accent }} /> Recent Agent Messages
              </span>
              <span className="text-[#9FB0D4] text-[10px] font-mono">LIVE FEED</span>
            </div>

            <div className="space-y-1.5">
              {agent.recentMessages.map((msg) => (
                <div 
                  key={msg.id}
                  className="p-2.5 rounded bg-[rgba(20,26,42,0.6)] border border-[rgba(170,182,208,0.18)] text-xs font-mono space-y-1"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span 
                      className="uppercase font-semibold"
                      style={{ color: msg.type === 'action' ? accent : '#FFD98A' }}
                    >
                      [{msg.type}]
                    </span>
                    <span className="text-[#9FB0D4]">{msg.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-[#E8EEFF]/90 font-sans leading-relaxed">
                    {msg.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Execution History */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#E8EEFF] uppercase font-semibold flex items-center gap-1.5">
                <History className="w-3.5 h-3.5" style={{ color: accent }} /> Execution History
              </span>
              <span className="text-[#9FB0D4] text-[10px] font-mono">PAST EXECUTIONS</span>
            </div>

            <div className="space-y-1">
              {agent.history.map((hist) => (
                <div 
                  key={hist.id}
                  className="flex items-center justify-between p-2 rounded bg-[rgba(20,26,42,0.6)] border border-[rgba(170,182,208,0.18)] text-xs font-mono"
                >
                  <div className="flex items-center gap-2 truncate">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: accent }} />
                    <span className="text-[#E8EEFF] truncate">{hist.action}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 text-[10px]">
                    <span className="text-[#E8EEFF]">{hist.duration}</span>
                    <span className="text-[#9FB0D4]">{hist.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer controls: Warm Lamp Gold CTA */}
        <div className="p-3 border-t border-[rgba(170,182,208,0.18)] bg-[#141A2A] flex items-center justify-between gap-2">
          <button
            onClick={() => onTriggerAction?.('restart')}
            className="flex-1 py-1.5 px-3 rounded bg-[#050814] border border-[rgba(170,182,208,0.22)] hover:border-[#FFD98A]/50 text-[#E8EEFF] text-xs font-mono flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3 h-3 text-[#FFD98A]" />
            <span>RERUN STEP</span>
          </button>
          <button
            onClick={() => onTriggerAction?.('override')}
            className="flex-1 py-1.5 px-3 rounded bg-[#FFD98A] text-[#14182A] hover:bg-[#FFE7AB] text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <Zap className="w-3 h-3 fill-current" />
            <span>DISPATCH NOW</span>
          </button>
        </div>
      </div>
    </div>
  );
};
export default AgentDetailPanel;
