import React from 'react';
import { AgentData } from '../../types';
import { AgentCard } from './AgentCard';
import { WorkflowConnector } from './WorkflowConnector';
import { 
  Sparkles, 
  Workflow
} from 'lucide-react';

interface WorkflowCanvasProps {
  agents: AgentData[];
  selectedAgentId: string | null;
  onSelectAgent: (id: string) => void;
  onOpenDetails: (agent: AgentData) => void;
  onSimulateInquiry: () => void;
  workflowRunning: boolean;
  onDispatchWorkflow: () => void;
}

export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({
  agents,
  selectedAgentId,
  onSelectAgent,
  onOpenDetails,
  onSimulateInquiry,
  workflowRunning,
  onDispatchWorkflow,
}) => {
  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto relative bg-[#0C1430] tech-grid-navy circuit-overlay-navy select-none">
      {/* Canvas Header / Stage Metadata bar */}
      <div className="px-5 py-3 border-b border-[#1E2638] bg-[#0A0E1A]/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#141A2A] border border-[rgba(170,182,208,0.25)] flex items-center justify-center text-[#FFD98A]">
            <Workflow className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold tracking-wider text-[#E8EEFF] uppercase font-mono">
                ORCHESTRATION GRAPH : INBOUND CONVERSION PIPELINE
              </h2>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#141A2A] border border-[rgba(170,182,208,0.2)] text-[9px] font-mono text-[#C8D4F0]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7A96C0]" />
                SYNCHRONIZED
              </span>
            </div>
            <p className="text-[10px] text-[#9FB0D4] mt-0.5 font-mono">
              Active Session #WF-2026-884 • 4 Autonomous Agents Interlinked • Consensus Quorum 100%
            </p>
          </div>
        </div>

        {/* Action buttons on Canvas Header */}
        <div className="flex items-center gap-2">
          <button
            onClick={onSimulateInquiry}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-mono font-semibold bg-[#FFD98A] text-[#14182A] hover:bg-[#FFE7AB] active:scale-[0.98] transition-all shadow-sm group"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#14182A] group-hover:rotate-12 transition-transform" />
            <span>Simulate Inbound Lead</span>
          </button>

          <div className="h-5 w-px bg-[#1E2638] mx-1 hidden sm:block" />

          <div className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-[#9FB0D4] bg-[#141A2A] px-2.5 py-1 rounded border border-[#1E2638]">
            <span>PIPELINE HEALTH:</span>
            <span className="text-[#E8EEFF] font-semibold">99.8%</span>
          </div>
        </div>
      </div>

      {/* Central Interactive Workflow Arena */}
      <div className="flex-1 p-4 lg:p-6 flex flex-col justify-center relative min-h-[550px]">
        {/* Relative container holding both SVG connectors and the 4 horizontal cards */}
        <div className="relative w-full max-w-7xl mx-auto">
          {/* SVG Workflow Connectors with animated flow */}
          <WorkflowConnector animated={workflowRunning} />

          {/* 4 Agent Cards arranged horizontally on Midnight Lighthouse dark glass */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-5 relative z-10">
            {agents.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                isSelected={selectedAgentId === agent.id}
                onSelect={() => onSelectAgent(agent.id)}
                onOpenDetails={() => onOpenDetails(agent)}
                onDispatch={onDispatchWorkflow}
              />
            ))}
          </div>

          {/* Bottom workflow status bar info */}
          <div className="mt-4 pt-3 border-t border-[#1E2638] flex flex-wrap items-center justify-between text-[10px] font-mono text-[#9FB0D4] px-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-0.5 bg-[#7A96C0] inline-block" />
                <span>Research Bus</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-0.5 bg-[#5A7AA8] inline-block" />
                <span>Analysis Pipe</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-0.5 bg-[#A8B8D8] inline-block" />
                <span>Sales Flow</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-0.5 bg-[#C8D4F0] inline-block" />
                <span>Operations Loop</span>
              </span>
            </div>

            <div className="flex items-center gap-3 text-[#7A96C0]">
              <span>PALETTE: MIDNIGHT LIGHTHOUSE</span>
              <span>CORE: #0C1430</span>
              <span>ACCENT: #FFD98A</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default WorkflowCanvas;
