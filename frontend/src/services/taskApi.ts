import { apiRequest } from './apiClient';

export interface TaskItem {
  id: string;
  title: string;
  assignedTo: string;
  status: 'dispatched' | 'pending' | 'syncing';
  createdAt?: string;
  updatedAt?: string;
}

export interface TaskUpdateRequest {
  status?: 'dispatched' | 'pending' | 'syncing';
  title?: string;
}

export const taskApi = {
  getTasks: async (): Promise<TaskItem[]> => {
    return apiRequest<TaskItem[]>('/api/tasks');
  },
  updateTask: async (id: string, update: TaskUpdateRequest): Promise<TaskItem> => {
    return apiRequest<TaskItem>(`/api/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(update),
    });
  },
};

