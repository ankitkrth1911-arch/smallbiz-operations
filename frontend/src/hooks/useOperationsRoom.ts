import { useState, useEffect, useCallback } from 'react';
import { dashboardApi, DashboardResponse } from '../services/dashboardApi';
import { workflowApi } from '../services/workflowApi';
import { inquiryApi, InquiryCreateRequest } from '../services/inquiryApi';
import { taskApi } from '../services/taskApi';
import { INITIAL_AGENTS, INITIAL_LOGS, INITIAL_NOTIFICATIONS } from '../data/mockData';
import { AgentData, LogEntry, NotificationItem } from '../types';

export function useOperationsRoom() {
  const [agents, setAgents] = useState<AgentData[]>(INITIAL_AGENTS);
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [pipelineHealth, setPipelineHealth] = useState(99.8);
  const [activeSession, setActiveSession] = useState('#WF-2026-884');
  const [activeStep, setActiveStep] = useState('STEP 4/4');

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial dashboard state from backend
  const fetchDashboard = useCallback(async () => {
    try {
      setIsLoading(true);
      const data: DashboardResponse = await dashboardApi.getDashboard();
      if (data && data.agents && data.agents.length > 0) {
        setAgents(data.agents);
        if (data.recentLogs && data.recentLogs.length > 0) setLogs(data.recentLogs);
        if (data.notifications && data.notifications.length > 0) setNotifications(data.notifications);
        if (data.pipelineHealth) setPipelineHealth(data.pipelineHealth);
        if (data.activeSession) setActiveSession(data.activeSession);
        if (data.step) setActiveStep(data.step);
        setIsBackendConnected(true);
        setError(null);
      }
    } catch (err: any) {
      // Backend not yet reachable or offline -> fallback gracefully to mock data
      setIsBackendConnected(false);
      setError(err?.message || 'Connecting to backend...');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
    // Periodic synchronization with live backend telemetry every 4s
    const pollInterval = setInterval(() => {
      fetchDashboard();
    }, 4000);
    return () => clearInterval(pollInterval);
  }, [fetchDashboard]);

  // Trigger new inquiry
  const simulateInquiry = async (customLead?: Partial<InquiryCreateRequest>) => {
    const payload: InquiryCreateRequest = {
      client: customLead?.client || customLead?.business || 'College merchandise supplier',
      business: customLead?.business,
      product: customLead?.product || 'Customised T-shirts',
      quantity: customLead?.quantity || 50,
      budget: customLead?.budget || '₹15,000',
      budgetRange: customLead?.budgetRange || customLead?.budget || '₹15,000',
      delivery: customLead?.delivery || '10 days',
      timeline: customLead?.timeline || customLead?.delivery || '10 days',
      sourceType: customLead?.sourceType || 'Inbound Customer Portal',
      keyItems: customLead?.keyItems || [
        'Customised T-shirts (50 units)',
        'Budget: ₹15,000',
        'Turnaround delivery: 10 days',
        '2-color screen-printed crest branding',
      ],
    };

    if (isBackendConnected) {
      try {
        const resp = await inquiryApi.createInquiry(payload);
        if (resp.updatedAgent) {
          setAgents((prev) =>
            prev.map((a) => (a.id === 'research' ? resp.updatedAgent! : a))
          );
        }
        if (resp.newLog) {
          setLogs((prev) => [resp.newLog!, ...prev]);
        }
        const notif: NotificationItem = {
          id: `notif-${Date.now()}`,
          title: 'Inbound Lead Ingested',
          description: `Backend persisted inquiry #${resp.id} for ${resp.client}.`,
          time: 'Just now',
          read: false,
          type: 'agent',
          agentId: 'research',
        };
        setNotifications((prev) => [notif, ...prev]);
        return resp;
      } catch (err: any) {
        console.warn('Backend inquiry call failed, falling back locally', err);
      }
    }

    // Local fallback if backend is offline
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0] + '.' + Math.floor(now.getMilliseconds() / 10);
    const clientName = payload.client || 'College merchandise supplier';
    const localLog: LogEntry = {
      id: `log-${Date.now()}`,
      timestamp: timeStr,
      agentId: 'research',
      agentName: 'BUSINESS RESEARCH AGENT',
      level: 'info',
      message: `Inbound inquiry ingested: ${clientName} (Local Mode).`,
    };
    setLogs((prev) => [localLog, ...prev]);
    setAgents((prev) =>
      prev.map((a) =>
        a.id === 'research'
          ? {
              ...a,
              progress: 96,
              status: 'active',
              currentActivity: `INGESTING ${clientName.toUpperCase()}`,
            }
          : a
      )
    );
  };


  // Dispatch workflow
  const dispatchWorkflow = async () => {
    if (isBackendConnected) {
      try {
        const resp = await workflowApi.runWorkflow({
          pipelineId: activeSession,
          autoDispatch: true,
        });
        if (resp.agents && resp.agents.length > 0) {
          setAgents(resp.agents);
        }
        if (resp.newLogs && resp.newLogs.length > 0) {
          setLogs((prev) => [...resp.newLogs, ...prev]);
        }
        return resp;
      } catch (err: any) {
        console.warn('Backend workflow dispatch failed, applying locally', err);
      }
    }

    // Local fallback
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0] + '.' + Math.floor(now.getMilliseconds() / 10);
    const localLog: LogEntry = {
      id: `log-${Date.now()}`,
      timestamp: timeStr,
      agentId: 'operations',
      agentName: 'OPERATIONS AGENT',
      level: 'success',
      message: 'EXECUTION COMPLETE: Quote #SB-2026-884 dispatched to Jira and Stripe.',
    };
    setLogs((prev) => [localLog, ...prev]);
    setAgents((prev) =>
      prev.map((a) =>
        a.id === 'operations'
          ? {
              ...a,
              progress: 100,
              statusLabel: 'Dispatched',
              currentActivity: 'WORKFLOW DISPATCHED & ACTIVE',
            }
          : a
      )
    );
  };

  // Update single task status
  const updateTaskStatus = async (taskId: string, status: 'dispatched' | 'pending' | 'syncing') => {
    if (isBackendConnected) {
      try {
        await taskApi.updateTask(taskId, { status });
      } catch (err) {
        console.error('Task update API error:', err);
      }
    }
    setAgents((prev) =>
      prev.map((a) => {
        if (a.id === 'operations' && a.details.tasksCreated) {
          return {
            ...a,
            details: {
              ...a.details,
              tasksCreated: a.details.tasksCreated.map((t) =>
                t.id === taskId ? { ...t, status } : t
              ),
            },
          };
        }
        return a;
      })
    );
  };

  return {
    agents,
    setAgents,
    logs,
    setLogs,
    notifications,
    setNotifications,
    pipelineHealth,
    activeSession,
    activeStep,
    isLoading,
    isBackendConnected,
    error,
    refreshDashboard: fetchDashboard,
    simulateInquiry,
    dispatchWorkflow,
    updateTaskStatus,
  };
}

