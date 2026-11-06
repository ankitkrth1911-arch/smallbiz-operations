import React from 'react';
import { Key, LogOut, Sliders, HardDrive } from 'lucide-react';
import { User } from '../../services/authApi';

interface UserProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings?: () => void;
  onSignOut?: () => void;
  user?: User | null;
}

export const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({
  isOpen,
  onClose,
  onOpenSettings,
  onSignOut,
  user,
}) => {
  if (!isOpen) return null;

  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'AM';
  const name = user?.fullName || 'Alex Morgan';
  const email = user?.email || 'alex@apexlogistics.com';
  const business = user?.businessName || 'Apex Logistics Ops';

  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <div className="absolute right-4 top-14 mt-1 w-64 bg-[rgba(10,14,26,0.92)] border border-[rgba(170,182,208,0.25)] rounded-lg shadow-2xl z-40 overflow-hidden font-mono text-xs animate-fade-in select-none backdrop-blur-md">
        {/* User Card */}
        <div className="p-3 border-b border-[rgba(170,182,208,0.18)] bg-[#141A2A]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded bg-[#1E2638] border border-[rgba(170,182,208,0.25)] flex items-center justify-center text-[#E8EEFF] font-bold font-mono text-xs">
              {initials}
            </div>
            <div className="truncate">
              <div className="font-semibold text-[#E8EEFF] truncate font-sans text-xs">
                {name}
              </div>
              <div className="text-[10px] text-[#9FB0D4] truncate">
                {email}
              </div>
              <div className="text-[9px] text-[#7A96C0] uppercase mt-0.5">
                Role: Enterprise Admin
              </div>
            </div>
          </div>
        </div>

        {/* Workspace Context */}
        <div className="p-2.5 bg-[#050814]/70 border-b border-[rgba(170,182,208,0.15)] text-[10px]">
          <div className="text-[#9FB0D4] uppercase">Current Workspace</div>
          <div className="flex items-center justify-between text-[#E8EEFF] font-medium mt-0.5">
            <span>{business}</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#141A2A] border border-[rgba(170,182,208,0.2)] text-[#C8D4F0]">PRIMARY</span>
          </div>
        </div>

        {/* Menu items */}
        <div className="p-1 space-y-0.5 text-[11px]">
          <button
            onClick={() => {
              onOpenSettings?.();
              onClose();
            }}
            className="w-full px-2.5 py-1.5 rounded hover:bg-[#141A2A] text-[#9FB0D4] hover:text-[#E8EEFF] flex items-center gap-2 transition-colors text-left"
          >
            <Sliders className="w-3.5 h-3.5 text-[#7A96C0]" />
            <span>Workspace Settings</span>
          </button>

          <button
            onClick={() => onClose()}
            className="w-full px-2.5 py-1.5 rounded hover:bg-[#141A2A] text-[#9FB0D4] hover:text-[#E8EEFF] flex items-center gap-2 transition-colors text-left"
          >
            <Key className="w-3.5 h-3.5 text-[#7A96C0]" />
            <span>API Keys & Credentials</span>
          </button>

          <button
            onClick={() => onClose()}
            className="w-full px-2.5 py-1.5 rounded hover:bg-[#141A2A] text-[#9FB0D4] hover:text-[#E8EEFF] flex items-center gap-2 transition-colors text-left"
          >
            <HardDrive className="w-3.5 h-3.5 text-[#7A96C0]" />
            <span>Model Quotas & Limits</span>
          </button>

          <div className="h-px bg-[rgba(170,182,208,0.15)] my-1" />

          <button
            onClick={() => {
              onClose();
              onSignOut?.();
            }}
            className="w-full px-2.5 py-1.5 rounded hover:bg-[#141A2A] text-[#9FB0D4] hover:text-[#FFD98A] flex items-center gap-2 transition-colors text-left"
          >
            <LogOut className="w-3.5 h-3.5 text-[#9FB0D4]" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
};
export default UserProfileDropdown;
