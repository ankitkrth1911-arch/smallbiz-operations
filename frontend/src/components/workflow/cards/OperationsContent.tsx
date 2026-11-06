import React, { useState } from 'react';
import { CheckSquare, Square, CheckCircle2, Zap } from 'lucide-react';
import { AgentData } from '../../../types';

interface Props {
  agent: AgentData;
  onDispatch?: () => void;
}

export const OperationsContent: React.FC<Props> = ({ agent, onDispatch }) => {
  const details = agent.details;
  const [checklist, setChecklist] = useState(details.approvalChecklist || []);
  const [dispatched, setDispatched] = useState(false);
  const accent = agent.accentColor || '#C8D4F0';

  const toggleCheck = (id: string) => {
    setChecklist(prev => 
      prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item)
    );
  };

  const handleApprove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDispatched(true);
    onDispatch?.();
  };

  return (
    <div className="space-y-2 text-xs">
      {/* Approval Checklist Block */}
      <div className="p-2 rounded bg-[rgba(20,26,42,0.6)] border border-[rgba(170,182,208,0.18)] space-y-1.5 shadow-sm">
        <div className="flex items-center justify-between text-[8.5px] font-mono">
          <span className="text-[#9FB0D4] uppercase tracking-wider font-medium">Governance Checklist</span>
          <span 
            className="font-semibold text-[8px] px-1 py-0.2 rounded border"
            style={{ 
              backgroundColor: `${accent}18`, 
              borderColor: `${accent}35`,
              color: accent 
            }}
          >
            {checklist.filter(c => c.checked).length} / {checklist.length} PASSED
          </span>
        </div>

        <div className="space-y-1">
          {checklist.map((item) => (
            <button
              key={item.id}
              onClick={(e) => {
                e.stopPropagation();
                toggleCheck(item.id);
              }}
              className="w-full flex items-center gap-1.5 text-left p-0.5 rounded hover:bg-[rgba(5,8,20,0.55)] transition-colors group"
            >
              {item.checked ? (
                <CheckSquare className="w-3 h-3 shrink-0" style={{ color: accent }} />
              ) : (
                <Square className="w-3 h-3 text-[#7A96C0] shrink-0 group-hover:text-[#E8EEFF]" />
              )}
              <span className={`text-[8.5px] leading-tight truncate font-sans ${
                item.checked ? 'text-[#E8EEFF] font-medium' : 'text-[#9FB0D4]'
              }`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Decision Metrics & Tasks Created */}
      <div className="p-2 rounded bg-[rgba(20,26,42,0.6)] border border-[rgba(170,182,208,0.18)] space-y-1 shadow-sm">
        <div className="flex items-center justify-between text-[8.5px] font-mono">
          <span className="text-[#9FB0D4] uppercase tracking-wider font-medium">Task Pipeline Dispatch</span>
          <span 
            className="text-[7.5px] font-mono font-medium px-1 py-0.2 rounded border"
            style={{ 
              backgroundColor: `${accent}18`, 
              borderColor: `${accent}35`,
              color: accent 
            }}
          >
            AUTO-ROUTED
          </span>
        </div>

        <div className="space-y-1">
          {details.tasksCreated?.slice(0, 3).map((task) => (
            <div 
              key={task.id}
              className="flex items-center justify-between text-[8.5px] font-mono px-1.5 py-0.5 rounded bg-[rgba(5,8,20,0.55)] border border-[rgba(170,182,208,0.12)]"
            >
              <span className="text-[#E8EEFF] truncate pr-1 font-sans text-[8.5px]">{task.title}</span>
              <span 
                className="text-[7.5px] px-1 py-0.2 rounded font-mono shrink-0 font-medium border"
                style={{ 
                  backgroundColor: task.status === 'dispatched' ? `${accent}18` : 'rgba(170,182,208,0.1)',
                  borderColor: task.status === 'dispatched' ? `${accent}35` : 'rgba(170,182,208,0.2)',
                  color: task.status === 'dispatched' ? accent : '#9FB0D4'
                }}
              >
                {task.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Final Decision Action Button: Uses #FFD98A Warm Lamp Gold CTA */}
      <div className="pt-0.5">
        <button
          onClick={handleApprove}
          disabled={dispatched}
          className={`w-full py-1.5 px-2.5 rounded text-[10px] font-mono font-semibold flex items-center justify-center gap-1.5 transition-all ${
            dispatched
              ? 'bg-[#141A2A] text-[#9FB0D4] border border-[rgba(170,182,208,0.25)] cursor-default'
              : 'bg-[#FFD98A] text-[#14182A] hover:bg-[#FFE7AB] active:scale-[0.98] shadow-sm'
          }`}
        >
          {dispatched ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" style={{ color: accent }} />
              <span>DISPATCH CONFIRMED</span>
            </>
          ) : (
            <>
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>APPROVE & DISPATCH WORKFLOW</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
export default OperationsContent;
