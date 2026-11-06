import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { WorkflowCanvas } from './components/workflow/WorkflowCanvas';
import { ProjectsView } from './components/views/ProjectsView';
import { LogsView } from './components/views/LogsView';
import { SettingsView } from './components/views/SettingsView';
import { AgentDetailPanel } from './components/modals/AgentDetailPanel';
import { ActivityPanel } from './components/modals/ActivityPanel';
import { SearchModal } from './components/modals/SearchModal';
import { NotificationsDropdown } from './components/modals/NotificationsDropdown';
import { UserProfileDropdown } from './components/modals/UserProfileDropdown';
import { InboundLeadModal } from './components/modals/InboundLeadModal';
import { AuthScreen } from './components/auth/AuthScreen';
import { authApi, User } from './services/authApi';
import { useOperationsRoom } from './hooks/useOperationsRoom';
import { AgentData } from './types';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab) return tab;
    }
    return 'dashboard';
  });
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>('research');
  const [inspectingAgent, setInspectingAgent] = useState<AgentData | null>(null);

  // Authentication session state
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const stored = authApi.getStoredUser();
    if (stored) return stored;
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('view') === 'dashboard' || params.get('demo') === '1') {
        return {
          id: 'usr_admin_apex',
          email: 'alex@apexlogistics.com',
          fullName: 'Alex Morgan',
          businessName: 'Apex Logistics Global',
        };
      }
    }
    return null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('view') === 'dashboard' || params.get('demo') === '1') {
        return true;
      }
    }
    return authApi.isAuthenticated();
  });

  // Modals & Panels state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isActivityOpen, setIsActivityOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isInboundLeadOpen, setIsInboundLeadOpen] = useState(false);


  // Workflow running state
  const [workflowRunning, setWorkflowRunning] = useState(true);

  // Centralized hook connecting to FastAPI backend
  const {
    agents,
    setAgents,
    logs,
    setLogs,
    notifications,
    setNotifications,
    isBackendConnected,
    simulateInquiry,
    dispatchWorkflow,
    refreshDashboard,
  } = useOperationsRoom();

  // Keyboard shortcut for Search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Periodic heartbeat animation to simulate active AI orchestration
  useEffect(() => {
    if (!workflowRunning) return;

    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => {
        const variance = Math.floor(Math.random() * 3) - 1;
        const newProgress = Math.min(100, Math.max(50, agent.progress + variance));
        return {
          ...agent,
          progress: newProgress,
        };
      }));
    }, 4000);

    return () => clearInterval(interval);
  }, [workflowRunning, setAgents]);

  const handleOpenDetails = (agent: AgentData) => {
    setInspectingAgent(agent);
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  if (!isAuthenticated || currentTab === 'auth') {
    return (
      <AuthScreen
        onAuthenticated={(user) => {
          setCurrentUser(user);
          setIsAuthenticated(true);
          setCurrentTab('dashboard');
        }}
      />
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0C1430] text-[#E8EEFF] font-sans antialiased">
      {/* 1. Left Fixed Sidebar (approx 175px wide) */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab === 'agents') {
            setCurrentTab('dashboard');
          } else {
            setCurrentTab(tab);
          }
        }}
        agentCount={agents.length}
        activeWorkflowCount={1}
      />

      {/* 2. Main Content Column */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Topbar */}
        <Topbar
          onOpenSearch={() => setIsSearchOpen(true)}
          onToggleNotifications={() => {
            setIsNotificationsOpen(prev => !prev);
            setIsProfileOpen(false);
          }}
          onToggleActivity={() => setIsActivityOpen(prev => !prev)}
          onToggleProfile={() => {
            setIsProfileOpen(prev => !prev);
            setIsNotificationsOpen(false);
          }}
          isNotificationsOpen={isNotificationsOpen}
          isActivityOpen={isActivityOpen}
          isProfileOpen={isProfileOpen}
          notifications={notifications}
          workflowRunning={workflowRunning}
          isBackendConnected={isBackendConnected}
          user={currentUser}
          onToggleWorkflow={() => setWorkflowRunning(prev => !prev)}
          onResetWorkflow={() => refreshDashboard()}
        />

        {/* View Switcher: Dashboard, Projects, Logs, Settings */}
        <main className="flex-1 overflow-hidden flex flex-col">
          {currentTab === 'dashboard' && (
            <WorkflowCanvas
              agents={agents}
              selectedAgentId={selectedAgentId}
              onSelectAgent={(id) => setSelectedAgentId(id)}
              onOpenDetails={handleOpenDetails}
              onSimulateInquiry={() => setIsInboundLeadOpen(true)}
              workflowRunning={workflowRunning}
              onDispatchWorkflow={() => dispatchWorkflow()}
            />
          )}

          {currentTab === 'projects' && <ProjectsView />}
          {currentTab === 'logs' && <LogsView logs={logs} />}
          {currentTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* 3. Flyout Modals & Slide-out Drawers */}
      <InboundLeadModal
        isOpen={isInboundLeadOpen}
        onClose={() => setIsInboundLeadOpen(false)}
        onSubmit={async (lead) => {
          await simulateInquiry(lead);
        }}
      />

      <AgentDetailPanel
        agent={inspectingAgent}
        isOpen={!!inspectingAgent}
        onClose={() => setInspectingAgent(null)}
        onTriggerAction={(action) => {
          if (action === 'restart') {
            simulateInquiry();
          } else if (action === 'override') {
            dispatchWorkflow();
          }
          setInspectingAgent(null);
        }}
      />

      <ActivityPanel
        isOpen={isActivityOpen}
        onClose={() => setIsActivityOpen(false)}
        logs={logs}
        onClearLogs={() => setLogs([])}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        agents={agents}
        onSelectAgent={(id) => {
          setSelectedAgentId(id);
          setCurrentTab('dashboard');
        }}
        onOpenDetails={handleOpenDetails}
      />

      <NotificationsDropdown
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllNotificationsRead}
        onSelectAgent={(id) => {
          setSelectedAgentId(id);
          setCurrentTab('dashboard');
        }}
      />

      <UserProfileDropdown
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onOpenSettings={() => setCurrentTab('settings')}
        user={currentUser}
        onSignOut={() => {
          authApi.logout();
          setIsAuthenticated(false);
          setCurrentUser(null);
        }}
      />
    </div>
  );
};

export default App;
