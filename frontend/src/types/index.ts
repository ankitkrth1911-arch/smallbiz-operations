export type AgentId = 'research' | 'analysis' | 'sales' | 'operations';

export type AgentStatusType = 'active' | 'processing' | 'composing' | 'finalizing' | 'ready' | 'idle' | 'paused';

export interface AgentMetric {
  label: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
}

export interface AgentTool {
  name: string;
  category: string;
  status: 'active' | 'standby';
  iconName: string;
}

export interface AgentMessage {
  id: string;
  timestamp: string;
  type: 'info' | 'action' | 'output' | 'system';
  content: string;
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  action: string;
  duration: string;
  status: 'completed' | 'running' | 'queued';
}

export interface AgentData {
  id: AgentId;
  order: number;
  title: string;
  role: string;
  status: AgentStatusType;
  statusLabel: string;
  currentActivity: string;
  progress: number;
  tokenCount: string;
  latency: string;
  icon: string;
  accentColor: string;
  summary: string;
  tools: AgentTool[];
  metrics: AgentMetric[];
  recentMessages: AgentMessage[];
  history: HistoryItem[];
  // Specific data for each card type
  details: {
    // Card 1 specific
    recordsProcessed?: {
      processed: number;
      total: number;
      fileType: string;
      sources: string[];
    };
    customerRequirements?: {
      client: string;
      tier: string;
      budgetRange: string;
      timeline: string;
      keyItems: string[];
    };
    // Card 2 specific
    feasibilityScore?: number;
    estimatedCost?: number;
    projectedMargin?: string;
    riskScore?: string;
    costBreakdown?: { category: string; amount: number; percentage: number }[];
    feasibilityInsights?: string[];
    // Card 3 specific
    quotationVersion?: string;
    quotationHash?: string;
    quotationTotal?: number;
    proposalSections?: { title: string; words: number; status: 'ready' | 'draft' }[];
    emailDraft?: {
      recipient: string;
      subject: string;
      preview: string;
    };
    // Card 4 specific
    confidenceScore?: number;
    approvalChecklist?: { id: string; label: string; checked: boolean; required: boolean }[];
    tasksCreated?: { id: string; title: string; assignedTo: string; status: 'dispatched' | 'pending' | 'syncing' }[];
    decisionOptions?: { id: string; label: string; primary?: boolean }[];
  };
}

export interface WorkflowConnectionState {
  fromId: AgentId;
  toId: AgentId;
  active: boolean;
  throughput: string;
  packetProgress: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  agentId: AgentId;
  agentName: string;
  level: 'info' | 'success' | 'warn' | 'debug';
  message: string;
  meta?: Record<string, any>;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'agent' | 'system' | 'approval';
  agentId?: AgentId;
}

