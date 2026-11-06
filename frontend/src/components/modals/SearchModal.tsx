import React, { useState, useEffect } from 'react';
import { Search, X, Bot, ArrowRight, CornerDownLeft, Zap } from 'lucide-react';
import { AgentData } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  agents: AgentData[];
  onSelectAgent: (id: string) => void;
  onOpenDetails: (agent: AgentData) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  agents,
  onSelectAgent,
  onOpenDetails,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredAgents = agents.filter(a => 
    a.title.toLowerCase().includes(query.toLowerCase()) ||
    a.role.toLowerCase().includes(query.toLowerCase()) ||
    a.currentActivity.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-[#0C1430]/80 backdrop-blur-md animate-fade-in select-none">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-[rgba(10,14,26,0.92)] border border-[rgba(170,182,208,0.25)] rounded-xl shadow-2xl z-10 overflow-hidden font-mono backdrop-blur-md">
        {/* Search Input Bar */}
        <div className="p-3 border-b border-[rgba(170,182,208,0.18)] flex items-center gap-3 bg-[#141A2A]">
          <Search className="w-4 h-4 text-[#7A96C0] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search agents, workflows, tasks, documents..."
            className="flex-1 bg-transparent text-[#E8EEFF] placeholder-[#9FB0D4]/50 text-xs focus:outline-none"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="text-[#9FB0D4] hover:text-[#E8EEFF]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <kbd className="text-[10px] bg-[#050814] px-1.5 py-0.5 rounded border border-[rgba(170,182,208,0.2)] text-[#9FB0D4]">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1 text-xs">
          <div className="px-2 py-1 text-[9px] text-[#9FB0D4] uppercase tracking-wider font-semibold">
            Operational Agents ({filteredAgents.length})
          </div>

          {filteredAgents.map((agent) => (
            <div
              key={agent.id}
              onClick={() => {
                onSelectAgent(agent.id);
                onOpenDetails(agent);
                onClose();
              }}
              className="w-full p-2 rounded hover:bg-[#141A2A]/60 border border-transparent hover:border-[rgba(170,182,208,0.2)] flex items-center justify-between transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-2.5 truncate">
                <div 
                  className="w-6 h-6 rounded flex items-center justify-center shrink-0 border"
                  style={{
                    backgroundColor: `${agent.accentColor}18`,
                    borderColor: `${agent.accentColor}40`,
                    color: agent.accentColor,
                  }}
                >
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="truncate text-left">
                  <div className="text-[#E8EEFF] font-medium truncate flex items-center gap-2">
                    <span>{agent.title}</span>
                    <span className="text-[9px]" style={{ color: agent.accentColor }}>({agent.status})</span>
                  </div>
                  <div className="text-[10px] text-[#9FB0D4] truncate font-sans">
                    {agent.currentActivity}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[#9FB0D4] group-hover:text-[#FFD98A] transition-colors shrink-0">
                <span className="text-[10px] hidden sm:inline">SELECT</span>
                <CornerDownLeft className="w-3 h-3" />
              </div>
            </div>
          ))}

          {/* Quick Actions */}
          <div className="px-2 pt-2 pb-1 text-[9px] text-[#9FB0D4] uppercase tracking-wider font-semibold">
            Quick System Operations
          </div>
          <div 
            onClick={() => {
              onSelectAgent('operations');
              onClose();
            }}
            className="w-full p-2 rounded hover:bg-[#141A2A]/60 border border-transparent hover:border-[rgba(170,182,208,0.2)] flex items-center justify-between transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Zap className="w-3.5 h-3.5 text-[#FFD98A]" />
              <span className="text-[#E8EEFF] text-[11px]">Dispatch Approved Workflows (Stripe & Jira)</span>
            </div>
            <ArrowRight className="w-3 h-3 text-[#9FB0D4]" />
          </div>
        </div>

        {/* Footer */}
        <div className="p-2 border-t border-[rgba(170,182,208,0.15)] bg-[#0A0E1A] text-[10px] text-[#9FB0D4] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>Navigation: <kbd className="px-1 py-0.2 bg-[#050814] border border-[rgba(170,182,208,0.2)] rounded">↑</kbd> <kbd className="px-1 py-0.2 bg-[#050814] border border-[rgba(170,182,208,0.2)] rounded">↓</kbd></span>
            <span>Select: <kbd className="px-1 py-0.2 bg-[#050814] border border-[rgba(170,182,208,0.2)] rounded">↵</kbd></span>
          </div>
          <span className="text-[#C8D4F0]">SMALLBIZ COMMAND RUNNER</span>
        </div>
      </div>
    </div>
  );
};
export default SearchModal;
