import React from 'react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Bot, 
  ScrollText, 
  Settings, 
  Key
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  agentCount: number;
  activeWorkflowCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  agentCount = 4,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: FolderKanban, badge: '3' },
    { id: 'agents', label: 'Agents', icon: Bot, countBadge: `(${agentCount})` },
    { id: 'logs', label: 'Logs', icon: ScrollText },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'auth', label: 'Auth Screen', icon: Key },
  ];

  return (
    <aside className="w-[175px] min-w-[175px] h-screen bg-[#0A0E1A] border-r border-[#1E2638] flex flex-col justify-between z-20 select-none">
      {/* Brand Header */}
      <div>
        <div className="h-14 px-3 flex items-center gap-2.5 border-b border-[#1E2638]">
          <div className="w-7 h-7 rounded bg-[#141A2A] border border-[rgba(170,182,208,0.25)] flex items-center justify-center text-[#FFD98A]">
            <svg 
              className="w-4 h-4 fill-current text-[#FFD98A]" 
              viewBox="0 0 24 24"
            >
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[12px] font-bold tracking-wider text-[#E8EEFF] leading-none font-mono">
              SMALLBIZ
            </span>
            <span className="text-[9px] text-[#9FB0D4] uppercase tracking-widest leading-tight mt-0.5">
              Ops Room
            </span>
          </div>
        </div>

        {/* Section Label */}
        <div className="px-3 pt-4 pb-1.5">
          <span className="text-[9px] font-semibold text-[#7A96C0] uppercase tracking-widest font-mono">
            Platform
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="px-1.5 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded text-[11px] font-medium transition-all group ${
                  isActive
                    ? 'bg-[#141A2A] text-[#E8EEFF] border-l-2 border-[#FFD98A] font-semibold shadow-sm'
                    : 'text-[#9FB0D4] hover:text-[#E8EEFF] hover:bg-[#141A2A]/50 border-l-2 border-transparent'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon 
                    className={`w-3.5 h-3.5 transition-colors ${
                      isActive ? 'text-[#FFD98A]' : 'text-[#7A96C0] group-hover:text-[#E8EEFF]'
                    }`} 
                  />
                  <span>{item.label}</span>
                </div>
                {item.countBadge && (
                  <span className={`text-[10px] font-mono ${
                    isActive ? 'text-[#FFD98A] font-semibold' : 'text-[#7A96C0]'
                  }`}>
                    {item.countBadge}
                  </span>
                )}
                {item.badge && (
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#050814] border border-[#1E2638] text-[#9FB0D4]">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Workflows Sub-section */}
        <div className="px-3 pt-5 pb-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-semibold text-[#7A96C0] uppercase tracking-widest font-mono">
              Live Pipelines
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFD98A]" />
          </div>
        </div>

        <div className="px-1.5 space-y-1">
          <div className="px-2.5 py-1.5 rounded bg-[#141A2A]/70 border border-[#1E2638] text-[10px]">
            <div className="flex items-center justify-between text-[#E8EEFF] mb-0.5">
              <span className="font-mono truncate">#WF-APEX-884</span>
              <span className="text-[8px] px-1 py-0.2 rounded bg-[rgba(255,217,138,0.15)] border border-[rgba(255,217,138,0.3)] text-[#FFD98A] font-mono font-medium">RUN</span>
            </div>
            <div className="text-[9px] text-[#9FB0D4] truncate">Apex RFP Sync Flow</div>
          </div>
        </div>
      </div>

      {/* Bottom info & Settings shortcut */}
      <div className="p-2 border-t border-[#1E2638] bg-[#0A0E1A]">
        <div className="p-2 rounded bg-[#141A2A]/70 border border-[#1E2638] space-y-1.5">
          <div className="flex items-center justify-between text-[9px] text-[#9FB0D4] font-mono">
            <span>ENGINE</span>
            <span className="text-[#E8EEFF]">v2.4.1</span>
          </div>
          <div className="flex items-center justify-between text-[9px] text-[#9FB0D4] font-mono">
            <span>STATUS</span>
            <span className="flex items-center gap-1 text-[#7A96C0]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7A96C0]" />
              ONLINE
            </span>
          </div>
          <div className="flex items-center justify-between text-[9px] text-[#9FB0D4] font-mono">
            <span>NODES</span>
            <span className="text-[#E8EEFF] font-medium">4 / 4 ACTIVE</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
export default Sidebar;
