import React from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { NotificationItem } from '../../types';

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onSelectAgent?: (id: string) => void;
}

export const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onSelectAgent,
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <div className="absolute right-12 top-14 mt-1 w-80 bg-[rgba(10,14,26,0.92)] border border-[rgba(170,182,208,0.25)] rounded-lg shadow-2xl z-40 overflow-hidden font-mono text-xs animate-fade-in select-none backdrop-blur-md">
        {/* Header */}
        <div className="p-3 border-b border-[rgba(170,182,208,0.18)] bg-[#141A2A] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-3.5 h-3.5 text-[#FFD98A]" />
            <span className="font-bold text-[#E8EEFF] tracking-wider uppercase text-[11px]">
              Notifications
            </span>
          </div>
          <button
            onClick={onMarkAllRead}
            className="text-[9px] text-[#9FB0D4] hover:text-[#E8EEFF] flex items-center gap-1 transition-colors"
          >
            <CheckCheck className="w-3 h-3 text-[#FFD98A]" />
            <span>Mark read</span>
          </button>
        </div>

        {/* List */}
        <div className="max-h-72 overflow-y-auto divide-y divide-[rgba(170,182,208,0.12)]">
          {notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                if (item.agentId && onSelectAgent) {
                  onSelectAgent(item.agentId);
                  onClose();
                }
              }}
              className={`p-3 transition-colors cursor-pointer hover:bg-[#141A2A]/50 ${
                !item.read ? 'bg-[#141A2A]/30' : ''
              }`}
            >
              <div className="flex items-center justify-between text-[10px] mb-1">
                <span className="font-semibold text-[#E8EEFF] truncate">
                  {item.title}
                </span>
                <span className="text-[#9FB0D4] text-[9px]">{item.time}</span>
              </div>
              <p className="text-[11px] text-[#9FB0D4] font-sans leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="p-6 text-center text-[#9FB0D4] text-[11px]">
              No unread notifications
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-2 border-t border-[rgba(170,182,208,0.15)] bg-[#0A0E1A] text-center text-[10px] text-[#9FB0D4]">
          SYSTEM ALERTS ENABLED (SLA 99.9%)
        </div>
      </div>
    </>
  );
};
export default NotificationsDropdown;
