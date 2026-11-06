import React from 'react';
import { FileCheck, CheckCircle2, FileText, Building2, DollarSign } from 'lucide-react';
import { AgentData } from '../../../types';

interface Props {
  agent: AgentData;
}

export const BusinessResearchContent: React.FC<Props> = ({ agent }) => {
  const details = agent.details;
  const records = details.recordsProcessed;
  const reqs = details.customerRequirements;
  const accent = agent.accentColor || '#7A96C0';

  return (
    <div className="space-y-2 text-xs">
      {/* Document Processing Counter & Live Stream */}
      <div className="p-2 rounded bg-[rgba(20,26,42,0.6)] border border-[rgba(170,182,208,0.18)] space-y-1.5 shadow-sm">
        <div className="flex items-center justify-between text-[8.5px] font-mono">
          <span className="text-[#9FB0D4] uppercase tracking-wider font-medium">Records Processed</span>
          <span className="font-semibold text-[#E8EEFF]">
            {records?.processed} / {records?.total} SOURCES
          </span>
        </div>

        {/* Small document processing visualization feed */}
        <div className="space-y-1">
          {records?.sources.slice(0, 3).map((source, i) => (
            <div 
              key={i} 
              className="flex items-center justify-between px-1.5 py-0.5 rounded bg-[rgba(5,8,20,0.55)] border border-[rgba(170,182,208,0.14)] text-[8.5px] font-mono"
            >
              <div className="flex items-center gap-1.5 truncate">
                <FileText className="w-2.5 h-2.5 shrink-0" style={{ color: accent }} />
                <span className="text-[#E8EEFF] truncate font-sans text-[9px]">{source}</span>
              </div>
              <span 
                className="flex items-center gap-0.5 text-[7.5px] shrink-0 font-medium px-1 py-0.2 rounded border"
                style={{ 
                  backgroundColor: `${accent}18`,
                  borderColor: `${accent}35`,
                  color: accent 
                }}
              >
                <FileCheck className="w-2.5 h-2.5" />
                PARSED
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Relevant Business Information Block */}
      <div className="p-2 rounded bg-[rgba(20,26,42,0.6)] border border-[rgba(170,182,208,0.18)] space-y-1 shadow-sm">
        <div className="text-[8.5px] font-mono text-[#9FB0D4] uppercase tracking-wider font-medium">
          Client Entity & Constraints
        </div>
        
        <div className="grid grid-cols-2 gap-1.5 text-[9.5px]">
          <div className="p-1.5 rounded bg-[rgba(5,8,20,0.55)] border border-[rgba(170,182,208,0.14)]">
            <div className="flex items-center gap-1 text-[7.5px] font-mono text-[#9FB0D4]">
              <Building2 className="w-2.5 h-2.5" style={{ color: accent }} /> CLIENT
            </div>
            <div className="font-semibold text-[#E8EEFF] truncate mt-0.5 font-sans">
              {reqs?.client}
            </div>
          </div>

          <div className="p-1.5 rounded bg-[rgba(5,8,20,0.55)] border border-[rgba(170,182,208,0.14)]">
            <div className="flex items-center gap-1 text-[7.5px] font-mono text-[#9FB0D4]">
              <DollarSign className="w-2.5 h-2.5" style={{ color: accent }} /> BUDGET
            </div>
            <div className="font-semibold text-[#E8EEFF] truncate mt-0.5 font-mono">
              {reqs?.budgetRange}
            </div>
          </div>
        </div>
      </div>

      {/* Extracted Customer Requirements List */}
      <div className="p-2 rounded bg-[rgba(20,26,42,0.6)] border border-[rgba(170,182,208,0.18)] space-y-1.5 shadow-sm">
        <div className="flex items-center justify-between text-[8.5px] font-mono">
          <span className="text-[#9FB0D4] uppercase tracking-wider font-medium">Requirements Extraction</span>
          <span 
            className="font-medium text-[8px] px-1 py-0.2 rounded border"
            style={{ 
              backgroundColor: `${accent}18`, 
              borderColor: `${accent}35`,
              color: accent 
            }}
          >
            4 VERIFIED
          </span>
        </div>

        <ul className="space-y-1">
          {reqs?.keyItems.map((item, idx) => (
            <li 
              key={idx} 
              className="flex items-start gap-1.5 text-[9px] text-[#E8EEFF] leading-tight"
            >
              <CheckCircle2 className="w-2.5 h-2.5 shrink-0 mt-0.5" style={{ color: accent }} />
              <span className="font-sans">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default BusinessResearchContent;
