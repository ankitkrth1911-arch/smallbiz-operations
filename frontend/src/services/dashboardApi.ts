import { apiRequest } from './apiClient';
import { AgentData, LogEntry, NotificationItem } from '../types';

export interface DashboardResponse {
  status: string;
  engineVersion: string;
  uptime: string;
  pipelineHealth: number;
  activeSession: string;
  step: string;
  agents: AgentData[];
  tasks: Array<{
    id: string;
    title: string;
    assignedTo: string;
    status: 'dispatched' | 'pending' | 'syncing';
  }>;
  recentLogs: LogEntry[];
  notifications: NotificationItem[];
}

export const dashboardApi = {
  getDashboard: async (): Promise<DashboardResponse> => {
    return apiRequest<DashboardResponse>('/api/dashboard');
  },
  getAgents: async (): Promise<AgentData[]> => {
    return apiRequest<AgentData[]>('/api/agents');
  },
};

