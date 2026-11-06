import React, { useState } from 'react';
import { X, Activity, Filter, Trash2 } from 'lucide-react';
import { LogEntry } from '../../types';

interface ActivityPanelProps {
  isOpen: boolean;
  onClose: () => void;
  logs: LogEntry[];
  onClearLogs?: () => void;
}

export const ActivityPanel: React.FC<ActivityPanelProps> = ({
  isOpen,
  onClose,
  logs,
  onClearLogs,
}) => {
  const [filterLevel, setFilterLevel] = useState<string>('all');

  if (!isOpen) return null;

  const filteredLogs = logs.filter(log => {
    if (filterLevel === 'all') return true;
    return log.level === filterLevel;
  });

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'success':
        return <span className="text-[#C8D4F0] font-mono text-[9px] px-1.5 py-0.2 rounded bg-[rgba(122,150,192,0.15)] border border-[rgba(122,150,192,0.3)] font-semibold">SUCCESS</span>;
      case 'warn':
        return <span className="text-[#FFD98A] font-mono text-[9px] px-1.5 py-0.2 rounded bg-[rgba(255,217,138,0.15)] border border-[rgba(255,217,138,0.3)] font-semibold">WARN</span>;
      case 'debug':
        return <span className="text-[#9FB0D4] font-mono text-[9px] px-1.5 py-0.2 rounded bg-[#141A2A] border border-[rgba(170,182,208,0.2)]">DEBUG</span>;
      case 'info':
      default:
        return <span className="text-[#A8B8D8] font-mono text-[9px] px-1.5 py-0.2 rounded bg-[rgba(90,122,168,0.15)] border border-[rgba(90,122,168,0.3)] font-semibold">INFO</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#0C1430]/80 backdrop-blur-md animate-fade-in select-none">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-[rgba(10,14,26,0.88)] backdrop-blur-md border-l border-[rgba(170,182,208,0.22)] h-full flex flex-col shadow-2xl z-10 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[rgba(170,182,208,0.18)] bg-[#141A2A] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-[#1E2638] border border-[rgba(170,182,208,0.25)] flex items-center justify-center text-[#FFD98A]">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#E8EEFF] font-mono uppercase tracking-wider">
                Live Activity Stream
              </h3>
              <p className="text-[10px] text-[#9FB0D4] font-mono">
                Real-time agent event orchestration trace
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-[#9FB0D4] hover:text-[#E8EEFF] hover:bg-[#1E2638] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="px-4 py-2 border-b border-[rgba(170,182,208,0.15)] bg-[#050814]/70 flex items-center justify-between text-[10px] font-mono">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3 h-3 text-[#7A96C0]" />
            {['all', 'info', 'success', 'debug'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterLevel(lvl)}
                className={`px-2 py-0.5 rounded uppercase tracking-wider transition-colors ${
                  filterLevel === lvl
                    ? 'bg-[#FFD98A] text-[#14182A] font-bold'
                    : 'text-[#9FB0D4] hover:text-[#E8EEFF] hover:bg-[#1E2638]'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {onClearLogs && (
            <button
              onClick={onClearLogs}
              className="text-[#9FB0D4] hover:text-[#E8EEFF] flex items-center gap-1 transition-colors"
              title="Clear Log History"
            >
              <Trash2 className="w-3 h-3" />
              <span>CLEAR</span>
            </button>
          )}
        </div>

        {/* Logs List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 font-mono text-xs">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="p-2.5 rounded bg-[rgba(20,26,42,0.6)] border border-[rgba(170,182,208,0.18)] space-y-1 hover:border-[#FFD98A]/50 transition-colors"
            >
              <div className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-2">
                  {getLevelBadge(log.level)}
                  <span className="text-[#E8EEFF] font-semibold">{log.agentName}</span>
                </div>
                <span className="text-[#9FB0D4] text-[9px]">{log.timestamp}</span>
              </div>
              <p className="text-[11px] text-[#E8EEFF]/90 font-sans leading-relaxed pt-0.5">
                {log.message}
              </p>
            </div>
          ))}

          {filteredLogs.length === 0 && (
            <div className="text-center py-12 text-[#9FB0D4] text-xs">
              No log entries match the selected filter.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[rgba(170,182,208,0.15)] bg-[#0A0E1A] text-[10px] font-mono text-[#9FB0D4] flex items-center justify-between">
          <span>EVENT STREAM: CONNECTED</span>
          <span className="text-[#E8EEFF]">{filteredLogs.length} EVENTS RECORDED</span>
        </div>
      </div>
    </div>
  );
};
export default ActivityPanel;
