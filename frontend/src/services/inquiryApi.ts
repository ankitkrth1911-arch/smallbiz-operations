import { apiRequest } from './apiClient';
import { AgentData, LogEntry } from '../types';

export interface InquiryCreateRequest {
  client?: string;
  business?: string;
  product?: string;
  quantity?: number | string;
  budget?: string;
  budgetRange?: string;
  delivery?: string;
  timeline?: string;
  sourceType?: string;
  keyItems?: string[];
}

export interface InquiryResponse {
  id: string;
  client: string;
  sourceType: string;
  status: string;
  budgetRange: string;
  timeline: string;
  keyItems: string[];
  createdAt: string;
  updatedAgent?: AgentData;
  newLog?: LogEntry;
}

export const inquiryApi = {
  createInquiry: async (data: InquiryCreateRequest): Promise<InquiryResponse> => {
    return apiRequest<InquiryResponse>('/api/inquiries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  getInquiries: async (): Promise<InquiryResponse[]> => {
    return apiRequest<InquiryResponse[]>('/api/inquiries');
  },
};


