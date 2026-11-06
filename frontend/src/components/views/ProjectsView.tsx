import React from 'react';
import { Plus } from 'lucide-react';

export const ProjectsView: React.FC = () => {
  const projects = [
    {
      id: 'p1',
      title: 'Apex Logistics RFP Inbound Automation',
      status: 'Active Pipeline',
      agents: '4 / 4 Online',
      lastRun: 'Just now',
      successRate: '99.4%',
      description: 'End-to-end inbound customer extraction, feasibility modeling, quotation drafting and ERP task staging.'
    },
    {
      id: 'p2',
      title: 'Zenith Retail Vendor Onboarding',
      status: 'Standby',
      agents: '3 / 4 Online',
      lastRun: '2 hours ago',
      successRate: '98.1%',
      description: 'Automated compliance auditing and supplier quotation validation.'
    },
    {
      id: 'p3',
      title: 'Metro Fleet Dispatcher Intelligence',
      status: 'Paused',
      agents: '2 / 4 Online',
      lastRun: 'Yesterday',
      successRate: '96.8%',
      description: 'Dynamic route costing, contract agreement extraction, and SLA monitoring.'
    }
  ];

  return (
    <div className="flex-1 p-6 overflow-y-auto font-mono text-xs space-y-5 bg-[#0C1430] tech-grid-navy circuit-overlay-navy select-none">
      <div className="flex items-center justify-between border-b border-[#1E2638] pb-4">
        <div>
          <h2 className="text-sm font-bold text-[#E8EEFF] uppercase tracking-wider">
            Enterprise Projects & Workflows
          </h2>
          <p className="text-[11px] text-[#9FB0D4] font-sans mt-0.5">
            Active multi-agent pipeline instances across your small business infrastructure.
          </p>
        </div>

        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#FFD98A] text-[#14182A] font-semibold hover:bg-[#FFE7AB] transition-colors shadow-sm">
          <Plus className="w-3.5 h-3.5" />
          <span>New Project</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((proj) => (
          <div 
            key={proj.id}
            className="p-4 rounded-lg bg-[rgba(10,14,26,0.78)] border border-[rgba(170,182,208,0.22)] hover:border-[rgba(170,182,208,0.45)] backdrop-blur-md transition-all space-y-3 shadow-card-restrained hover:shadow-card-elevated"
          >
            <div className="flex items-center justify-between">
              <span className="text-[9px] px-2 py-0.5 rounded bg-[#141A2A] border border-[rgba(170,182,208,0.2)] text-[#C8D4F0] font-medium">
                {proj.status}
              </span>
              <span className="text-[10px] text-[#9FB0D4]">{proj.lastRun}</span>
            </div>

            <div>
              <h3 className="font-semibold text-[#E8EEFF] font-sans text-sm">
                {proj.title}
              </h3>
              <p className="text-[11px] text-[#9FB0D4] font-sans mt-1 leading-relaxed">
                {proj.description}
              </p>
            </div>

            <div className="pt-2 border-t border-[rgba(170,182,208,0.15)] flex items-center justify-between text-[10px] text-[#9FB0D4]">
              <span>AGENTS: <strong className="text-[#E8EEFF]">{proj.agents}</strong></span>
              <span>SLA: <strong className="text-[#7A96C0]">{proj.successRate}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ProjectsView;
