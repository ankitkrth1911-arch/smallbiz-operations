import React, { useState } from 'react';
import { Download, Search } from 'lucide-react';
import { LogEntry } from '../../types';

interface LogsViewProps {
  logs: LogEntry[];
}

export const LogsView: React.FC<LogsViewProps> = ({ logs }) => {
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('all');

  const filteredLogs = logs.filter(l => {
    const matchesSearch = l.message.toLowerCase().includes(search.toLowerCase()) ||
                          l.agentName.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = level === 'all' || l.level === level;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="flex-1 p-6 overflow-y-auto font-mono text-xs space-y-4 bg-[#0C1430] tech-grid-navy circuit-overlay-navy select-none">
      <div className="flex items-center justify-between border-b border-[#1E2638] pb-4">
        <div>
          <h2 className="text-sm font-bold text-[#E8EEFF] uppercase tracking-wider">
            System & Agent Execution Logs
          </h2>
          <p className="text-[11px] text-[#9FB0D4] font-sans mt-0.5">
            Full forensic timeline of inter-agent RPCs, model outputs, and external integrations.
          </p>
        </div>

        <button 
          onClick={() => {
            const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `smallbiz-logs-${Date.now()}.json`;
            a.click();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#141A2A] border border-[rgba(170,182,208,0.22)] text-[#E8EEFF] hover:border-[#FFD98A]/60 transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-[#FFD98A]" />
          <span>Export JSON</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded bg-[rgba(10,14,26,0.78)] border border-[rgba(170,182,208,0.22)] backdrop-blur-md">
        <div className="flex items-center gap-2 flex-1 max-w-md bg-[#050814] px-3 py-1.5 rounded border border-[rgba(170,182,208,0.2)]">
          <Search className="w-3.5 h-3.5 text-[#7A96C0] shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter log messages, agents, hashes..."
            className="w-full bg-transparent text-[#E8EEFF] placeholder-[#9FB0D4]/50 text-xs focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 text-[10px]">
          <span className="text-[#9FB0D4] mr-1">LEVEL:</span>
          {['all', 'info', 'success', 'warn', 'debug'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevel(lvl)}
              className={`px-2 py-1 rounded uppercase tracking-wider transition-colors ${
                level === lvl
                  ? 'bg-[#FFD98A] text-[#14182A] font-bold'
                  : 'text-[#9FB0D4] hover:text-[#E8EEFF] hover:bg-[#141A2A]'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Log Feed Table */}
      <div className="rounded-lg bg-[rgba(10,14,26,0.78)] border border-[rgba(170,182,208,0.22)] overflow-hidden shadow-card-restrained backdrop-blur-md">
        <div className="grid grid-cols-12 gap-2 p-2.5 bg-[#141A2A] border-b border-[rgba(170,182,208,0.18)] text-[10px] text-[#9FB0D4] uppercase">
          <div className="col-span-2">TIMESTAMP</div>
          <div className="col-span-1">LEVEL</div>
          <div className="col-span-3">AGENT</div>
          <div className="col-span-6">MESSAGE</div>
        </div>

        <div className="divide-y divide-[rgba(170,182,208,0.12)] max-h-[500px] overflow-y-auto text-[11px]">
          {filteredLogs.map((log) => (
            <div key={log.id} className="grid grid-cols-12 gap-2 p-2.5 hover:bg-[#141A2A]/50 transition-colors items-start">
              <div className="col-span-2 text-[#9FB0D4] text-[10px] font-mono">
                {log.timestamp}
              </div>
              <div className="col-span-1">
                <span className={`text-[9px] px-1 py-0.2 rounded font-mono font-medium border ${
                  log.level === 'success' ? 'bg-[rgba(122,150,192,0.15)] text-[#C8D4F0] border-[rgba(122,150,192,0.3)]' :
                  log.level === 'warn' ? 'bg-[rgba(255,217,138,0.15)] text-[#FFD98A] border-[rgba(255,217,138,0.3)]' :
                  'bg-[#141A2A] text-[#A8B8D8] border-[rgba(170,182,208,0.2)]'
                }`}>
                  {log.level.toUpperCase()}
                </span>
              </div>
              <div className="col-span-3 text-[#E8EEFF] font-medium truncate">
                {log.agentName}
              </div>
              <div className="col-span-6 text-[#E8EEFF]/90 font-sans leading-relaxed">
                {log.message}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default LogsView;
