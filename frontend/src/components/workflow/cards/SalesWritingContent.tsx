import React from 'react';
import { Mail, Hash } from 'lucide-react';
import { AgentData } from '../../../types';

interface Props {
  agent: AgentData;
}

export const SalesWritingContent: React.FC<Props> = ({ agent }) => {
  const details = agent.details;
  const email = details.emailDraft;
  const accent = agent.accentColor || '#A8B8D8';

  return (
    <div className="space-y-2 text-xs">
      {/* Proposal Editor & Quotation Version Header */}
      <div className="p-2 rounded bg-[rgba(20,26,42,0.6)] border border-[rgba(170,182,208,0.18)] space-y-1.5 shadow-sm">
        <div className="flex items-center justify-between text-[8.5px] font-mono">
          <div className="flex items-center gap-1.5 text-[#9FB0D4]">
            <Hash className="w-2.5 h-2.5" style={{ color: accent }} />
            <span>{details.quotationVersion}</span>
            <span className="text-[rgba(170,182,208,0.4)]">•</span>
            <span className="font-semibold" style={{ color: accent }}>{details.quotationHash}</span>
          </div>
          <span className="text-[8px] text-[#9FB0D4]">Auto-saved 2m ago</span>
        </div>

        {/* Quotation pricing header */}
        <div className="flex items-center justify-between p-1.5 rounded bg-[rgba(5,8,20,0.55)] border border-[rgba(170,182,208,0.14)]">
          <div>
            <div className="text-[7.5px] font-mono text-[#9FB0D4] uppercase font-medium">CALCULATED QUOTATION</div>
            <div className="text-sm font-bold font-mono text-[#E8EEFF] leading-none mt-0.5">
              ${details.quotationTotal?.toLocaleString()}
            </div>
          </div>
          <span 
            className="text-[8px] font-mono px-1.5 py-0.5 rounded border font-semibold"
            style={{
              backgroundColor: `${accent}18`,
              borderColor: `${accent}35`,
              color: accent,
            }}
          >
            3-TIER SCHEDULE
          </span>
        </div>

        {/* Structured proposal sections list */}
        <div className="space-y-1 pt-0.5">
          {details.proposalSections?.slice(0, 3).map((sec, idx) => (
            <div 
              key={idx}
              className="flex items-center justify-between text-[8.5px] font-mono px-1.5 py-0.5 rounded bg-[rgba(5,8,20,0.55)] text-[#9FB0D4] border border-[rgba(170,182,208,0.12)]"
            >
              <span className="truncate pr-1 text-[#E8EEFF] font-sans">{sec.title}</span>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[#9FB0D4] text-[7.5px]">{sec.words}w</span>
                <span 
                  className="w-1.5 h-1.5 rounded-full" 
                  style={{ backgroundColor: sec.status === 'ready' ? accent : '#7A96C0' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Communication / Email Preview */}
      <div className="p-2 rounded bg-[rgba(20,26,42,0.6)] border border-[rgba(170,182,208,0.18)] space-y-1.5 shadow-sm">
        <div className="flex items-center justify-between text-[8.5px] font-mono">
          <span className="flex items-center gap-1 text-[#9FB0D4] uppercase font-medium">
            <Mail className="w-2.5 h-2.5" style={{ color: accent }} /> Client Email Draft
          </span>
          <span 
            className="text-[8px] font-mono font-medium px-1 py-0.2 rounded border"
            style={{ 
              backgroundColor: `${accent}18`, 
              borderColor: `${accent}35`,
              color: accent 
            }}
          >
            READY
          </span>
        </div>

        <div className="p-1.5 rounded bg-[rgba(5,8,20,0.55)] border border-[rgba(170,182,208,0.14)] space-y-1">
          <div className="text-[8px] font-mono truncate" style={{ color: accent }}>
            TO: {email?.recipient}
          </div>
          <div className="text-[8.5px] font-medium text-[#E8EEFF] truncate font-sans">
            SUBJ: {email?.subject}
          </div>
          <p 
            className="text-[8.5px] text-[#9FB0D4] line-clamp-2 leading-relaxed italic border-l-2 pl-1.5 font-sans"
            style={{ borderColor: accent }}
          >
            "{email?.preview}"
          </p>
        </div>
      </div>
    </div>
  );
};
export default SalesWritingContent;
