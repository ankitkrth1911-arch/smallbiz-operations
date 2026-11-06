import React from 'react';
import { 
  Search, 
  Bell, 
  Activity, 
  ChevronDown, 
  Play, 
  Pause, 
  RotateCcw, 
  Command
} from 'lucide-react';
import { NotificationItem } from '../../types';
import { User } from '../../services/authApi';

interface TopbarProps {
  onOpenSearch: () => void;
  onToggleNotifications: () => void;
  onToggleActivity: () => void;
  onToggleProfile: () => void;
  isNotificationsOpen: boolean;
  isActivityOpen: boolean;
  isProfileOpen: boolean;
  notifications: NotificationItem[];
  workflowRunning: boolean;
  isBackendConnected?: boolean;
  user?: User | null;
  onToggleWorkflow: () => void;
  onResetWorkflow: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  onOpenSearch,
  onToggleNotifications,
  onToggleActivity,
  onToggleProfile,
  isNotificationsOpen,
  isActivityOpen,
  isProfileOpen,
  notifications,
  workflowRunning,
  isBackendConnected = false,
  user,
  onToggleWorkflow,
  onResetWorkflow,
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;
  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'AM';
  const displayName = user?.fullName || 'Alex Morgan';
  const roleTitle = user?.businessName ? 'Manager' : 'Admin';

  return (
    <header className="h-14 bg-[#0A0E1A] border-b border-[#1E2638] px-4 flex items-center justify-between z-10 shrink-0 select-none">
      {/* Left: Search input & workflow badge */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onOpenSearch}
          className="flex items-center justify-between w-72 px-3 py-1.5 rounded bg-[#141A2A] border border-[rgba(170,182,208,0.2)] text-[#9FB0D4] hover:text-[#E8EEFF] hover:border-[#FFD98A]/50 transition-all text-xs group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-[#7A96C0] group-hover:text-[#FFD98A] transition-colors" />
            <span className="text-[11px]">Search agents, workflows, logs...</span>
          </div>
          <kbd className="flex items-center gap-0.5 text-[9px] font-mono bg-[#050814] px-1.5 py-0.5 rounded border border-[#1E2638] text-[#9FB0D4]">
            <Command className="w-2.5 h-2.5" /> K
          </kbd>
        </button>

        {/* Workflow Breadcrumb / Stage indicator */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded bg-[#141A2A] border border-[#1E2638] text-[11px]">
          <span className="text-[#7A96C0] font-mono text-[10px]">PIPELINE:</span>
          <span className="text-[#E8EEFF] font-medium">Inbound Proposal Automation</span>
          <span className="w-1 h-1 rounded-full bg-[#FFD98A]" />
          <span className="text-[#9FB0D4] text-[10px] font-mono">STEP 4/4</span>
        </div>

        {/* Backend REST API status pill */}
        <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded border text-[10px] font-mono transition-colors ${
          isBackendConnected
            ? 'bg-[rgba(122,150,192,0.15)] border-[rgba(122,150,192,0.35)] text-[#C8D4F0]'
            : 'bg-[rgba(255,217,138,0.1)] border-[rgba(255,217,138,0.25)] text-[#FFD98A]'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${
            isBackendConnected ? 'bg-[#7A96C0] animate-pulse' : 'bg-[#FFD98A]'
          }`} />
          <span className="font-semibold">{isBackendConnected ? 'API CONNECTED' : 'OFFLINE'}</span>
        </div>
      </div>

      {/* Center/Right: Workflow Playback Controls */}
      <div className="flex items-center gap-2">
        <div className="flex items-center bg-[#141A2A] rounded border border-[#1E2638] p-0.5">
          <button
            onClick={onToggleWorkflow}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
              workflowRunning
                ? 'bg-[#FFD98A] text-[#14182A] font-semibold hover:bg-[#FFE7AB] shadow-sm'
                : 'text-[#9FB0D4] hover:text-[#E8EEFF] hover:bg-[#1E2638]'
            }`}
            title={workflowRunning ? 'Pause Workflow Execution' : 'Resume Workflow Execution'}
          >
            {workflowRunning ? (
              <>
                <Pause className="w-3 h-3 fill-current" />
                <span>ACTIVE</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current text-[#FFD98A]" />
                <span className="text-[#E8EEFF]">RESUME</span>
              </>
            )}
          </button>

          <button
            onClick={onResetWorkflow}
            className="p-1 rounded text-[#9FB0D4] hover:text-[#E8EEFF] hover:bg-[#1E2638] transition-colors"
            title="Reset Workflow Simulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-4 w-px bg-[#1E2638] mx-1" />

        {/* Activity feed toggle button */}
        <button
          onClick={onToggleActivity}
          className={`p-2 rounded border transition-all relative ${
            isActivityOpen
              ? 'bg-[#1E2638] border-[#FFD98A] text-[#FFD98A]'
              : 'border-[#1E2638] bg-[#141A2A] text-[#9FB0D4] hover:text-[#E8EEFF] hover:border-[#FFD98A]/40'
          }`}
          title="Toggle Real-time Activity Drawer"
        >
          <Activity className="w-4 h-4" />
        </button>

        {/* Notifications toggle button */}
        <button
          onClick={onToggleNotifications}
          className={`p-2 rounded border transition-all relative ${
            isNotificationsOpen
              ? 'bg-[#1E2638] border-[#FFD98A] text-[#FFD98A]'
              : 'border-[#1E2638] bg-[#141A2A] text-[#9FB0D4] hover:text-[#E8EEFF] hover:border-[#FFD98A]/40'
          }`}
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FFD98A] text-[#14182A] text-[9px] font-bold font-mono flex items-center justify-center border border-[#0A0E1A]">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User profile dropdown button */}
        <div className="relative">
          <button
            onClick={onToggleProfile}
            className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded border border-[#1E2638] bg-[#141A2A] hover:border-[#FFD98A]/50 transition-all text-xs"
          >
            <div className="w-6 h-6 rounded bg-[#1E2638] border border-[rgba(170,182,208,0.25)] flex items-center justify-center text-[10px] font-mono text-[#E8EEFF] font-semibold">
              {initials}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-[11px] font-medium text-[#E8EEFF] leading-none">
                {displayName}
              </span>
              <span className="text-[9px] text-[#9FB0D4] leading-none mt-0.5 font-mono">
                {roleTitle}
              </span>
            </div>
            <ChevronDown className="w-3 h-3 text-[#7A96C0]" />
          </button>
        </div>
      </div>
    </header>
  );
};
export default Topbar;
