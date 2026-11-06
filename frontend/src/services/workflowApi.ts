import { apiRequest } from './apiClient';
import { AgentData, LogEntry } from '../types';

export interface WorkflowRunRequest {
  pipelineId?: string;
  inquiryId?: string;
  autoDispatch?: boolean;
}

export interface WorkflowRunResponse {
  success: boolean;
  pipelineId: string;
  message: string;
  agents: AgentData[];
  newLogs: LogEntry[];
  timestamp: string;
}

export const workflowApi = {
  runWorkflow: async (payload: WorkflowRunRequest = {}): Promise<WorkflowRunResponse> => {
    return apiRequest<WorkflowRunResponse>('/api/workflows/run', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};

