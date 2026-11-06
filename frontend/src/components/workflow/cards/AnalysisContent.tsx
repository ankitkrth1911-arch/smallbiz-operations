import React from 'react';
import { AgentData } from '../../../types';
import { MiniChart } from '../MiniChart';

interface Props {
  agent: AgentData;
}

export const AnalysisContent: React.FC<Props> = ({ agent }) => {
  const details = agent.details;
  const accent = agent.accentColor || '#5A7AA8';

  return (
    <div className="space-y-2 text-xs">
      {/* Mini Bar Chart for Cost Allocation & Feasibility */}
      <MiniChart data={details.costBreakdown} accentColor={accent} />

      {/* Business Metrics Grid */}
      <div className="grid grid-cols-2 gap-1.5">
        <div className="p-2 rounded bg-[rgba(20,26,42,0.6)] border border-[rgba(170,182,208,0.18)] shadow-sm">
          <div className="text-[8px] font-mono text-[#9FB0D4] uppercase tracking-wider font-medium">
            FEASIBILITY SCORE
          </div>
          <div className="text-sm font-bold text-[#E8EEFF] font-mono mt-0.5">
            {details.feasibilityScore}%
          </div>
          <div className="text-[8px] font-mono mt-0.5" style={{ color: accent }}>
            +2.4% vs benchmark
          </div>
        </div>

        <div className="p-2 rounded bg-[rgba(20,26,42,0.6)] border border-[rgba(170,182,208,0.18)] shadow-sm">
          <div className="text-[8px] font-mono text-[#9FB0D4] uppercase tracking-wider font-medium">
            PROJECTED MARGIN
          </div>
          <div className="text-sm font-bold text-[#E8EEFF] font-mono mt-0.5">
            {details.projectedMargin}
          </div>
          <div className="text-[8px] text-[#9FB0D4] font-mono mt-0.5">
            Risk: {details.riskScore}
          </div>
        </div>
      </div>

      {/* Feasibility Insights Block */}
      <div className="p-2 rounded bg-[rgba(20,26,42,0.6)] border border-[rgba(170,182,208,0.18)] space-y-1.5 shadow-sm">
        <div className="flex items-center justify-between text-[8.5px] font-mono">
          <span className="text-[#9FB0D4] uppercase tracking-wider font-medium">Feasibility Insights</span>
          <span 
            className="text-[8px] font-mono font-medium px-1 py-0.2 rounded border"
            style={{ 
              backgroundColor: `${accent}18`, 
              borderColor: `${accent}35`,
              color: accent 
            }}
          >
            CONFIRMED
          </span>
        </div>

        <div className="space-y-1">
          {details.feasibilityInsights?.map((insight, idx) => (
            <div 
              key={idx} 
              className="flex items-start gap-1.5 text-[8.5px] text-[#E8EEFF] leading-snug"
            >
              <div 
                className="w-1.5 h-1.5 rounded-full shrink-0 mt-1" 
                style={{ backgroundColor: accent }}
              />
              <span className="font-sans">{insight}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default AnalysisContent;
