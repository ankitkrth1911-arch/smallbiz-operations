import React, { useState } from 'react';
import { Shield, Cpu, Save, CheckCircle2 } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [saved, setSaved] = useState(false);
  const [consensusThreshold, setConsensusThreshold] = useState('95');
  const [autoDispatch, setAutoDispatch] = useState(true);
  const [maxTokens, setMaxTokens] = useState('8192');

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto font-mono text-xs space-y-5 bg-[#0C1430] tech-grid-navy circuit-overlay-navy select-none">
      <div className="flex items-center justify-between border-b border-[#1E2638] pb-4">
        <div>
          <h2 className="text-sm font-bold text-[#E8EEFF] uppercase tracking-wider">
            SmallBiz Operations Room Settings
          </h2>
          <p className="text-[11px] text-[#9FB0D4] font-sans mt-0.5">
            Configure agent consensus thresholds, security policies, and automated dispatch triggers.
          </p>
        </div>

        <button 
          onClick={handleSave}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#FFD98A] text-[#14182A] font-semibold hover:bg-[#FFE7AB] transition-colors shadow-sm"
        >
          {saved ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>SAVED</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              <span>Save Settings</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl">
        {/* Consensus & Guardrails */}
        <div className="p-4 rounded-lg bg-[rgba(10,14,26,0.78)] border border-[rgba(170,182,208,0.22)] backdrop-blur-md space-y-3 shadow-card-restrained">
          <div className="flex items-center gap-2 text-[#E8EEFF] font-semibold">
            <Shield className="w-4 h-4 text-[#FFD98A]" />
            <span className="font-sans text-sm">Orchestration & Governance</span>
          </div>

          <div className="space-y-3 pt-1">
            <div>
              <label className="text-[#9FB0D4] block mb-1">
                Minimum Consensus Quorum (%):
              </label>
              <input
                type="number"
                value={consensusThreshold}
                onChange={(e) => setConsensusThreshold(e.target.value)}
                className="w-full bg-[#050814] border border-[rgba(170,182,208,0.22)] rounded px-2.5 py-1.5 text-[#E8EEFF] text-xs focus:outline-none focus:border-[#FFD98A]"
              />
              <span className="text-[9px] text-[#9FB0D4] mt-1 block">
                Workflows require this confidence level before triggering Operations Agent.
              </span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <div className="text-[#E8EEFF] font-medium">Automatic Dispatch Mode</div>
                <div className="text-[9px] text-[#9FB0D4]">Send approved quotes to Stripe and Jira automatically</div>
              </div>
              <input
                type="checkbox"
                checked={autoDispatch}
                onChange={(e) => setAutoDispatch(e.target.checked)}
                className="w-4 h-4 accent-[#FFD98A] rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Engine Parameters & Palette Specification */}
        <div className="p-4 rounded-lg bg-[rgba(10,14,26,0.78)] border border-[rgba(170,182,208,0.22)] backdrop-blur-md space-y-3 shadow-card-restrained">
          <div className="flex items-center gap-2 text-[#E8EEFF] font-semibold">
            <Cpu className="w-4 h-4 text-[#7A96C0]" />
            <span className="font-sans text-sm">Design System & Runtime</span>
          </div>

          <div className="space-y-3 pt-1">
            <div>
              <label className="text-[#9FB0D4] block mb-1">
                Max Token Budget per Run:
              </label>
              <input
                type="text"
                value={maxTokens}
                onChange={(e) => setMaxTokens(e.target.value)}
                className="w-full bg-[#050814] border border-[rgba(170,182,208,0.22)] rounded px-2.5 py-1.5 text-[#E8EEFF] text-xs focus:outline-none focus:border-[#FFD98A]"
              />
            </div>

            <div>
              <label className="text-[#9FB0D4] block mb-1">
                Active Theme System:
              </label>
              <div className="p-2.5 rounded bg-[#141A2A] border border-[rgba(170,182,208,0.22)] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[#E8EEFF] font-semibold">Midnight Lighthouse</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-[rgba(255,217,138,0.15)] text-[#FFD98A] border border-[rgba(255,217,138,0.3)] font-semibold">APPROVED</span>
                </div>
                <div className="text-[9px] text-[#9FB0D4] font-mono leading-relaxed">
                  Background: #0C1430 • Cards: #0A0E1A • Primary Accent: #FFD98A • Secondary: #9FB0D4
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <span className="flex items-center gap-1 text-[8.5px] text-[#7A96C0]">
                    <span className="w-2 h-2 rounded-full bg-[#7A96C0]" /> Research
                  </span>
                  <span className="flex items-center gap-1 text-[8.5px] text-[#5A7AA8]">
                    <span className="w-2 h-2 rounded-full bg-[#5A7AA8]" /> Analysis
                  </span>
                  <span className="flex items-center gap-1 text-[8.5px] text-[#A8B8D8]">
                    <span className="w-2 h-2 rounded-full bg-[#A8B8D8]" /> Sales
                  </span>
                  <span className="flex items-center gap-1 text-[8.5px] text-[#C8D4F0]">
                    <span className="w-2 h-2 rounded-full bg-[#C8D4F0]" /> Operations
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SettingsView;
