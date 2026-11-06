import { AgentData, LogEntry, NotificationItem } from '../types';

export const INITIAL_AGENTS: AgentData[] = [
  {
    id: 'research',
    order: 1,
    title: 'BUSINESS RESEARCH AGENT',
    role: 'Inbound Intelligence & Document Parsing',
    status: 'active',
    statusLabel: 'Active',
    currentActivity: 'SCANNING BUSINESS INQUIRY',
    progress: 88,
    tokenCount: '4.8k tokens/s',
    latency: '42ms',
    icon: 'Search',
    accentColor: '#7A96C0',
    summary: 'Receives business inquiries, parses unstructured RFP docs, and extracts core operational requirements.',
    tools: [
      { name: 'Document Parser OCR', category: 'Ingestion', status: 'active', iconName: 'FileText' },
      { name: 'HubSpot CRM Sync', category: 'Database', status: 'active', iconName: 'Database' },
      { name: 'Web Entity Validator', category: 'Enrichment', status: 'active', iconName: 'Globe' },
      { name: 'Semantic Tokenizer', category: 'NLP', status: 'standby', iconName: 'Cpu' },
    ],
    metrics: [
      { label: 'Sources Scanned', value: '14 / 16', change: '+4 docs', isPositive: true },
      { label: 'Extraction Acc.', value: '99.4%', change: '+0.8%', isPositive: true },
      { label: 'Confidence', value: '96.2%' },
    ],
    recentMessages: [
      { id: 'm1', timestamp: '14:22:04', type: 'info', content: 'Inbound inquiry #INQ-8892 ingested from Webhook /forms/rfp' },
      { id: 'm2', timestamp: '14:22:18', type: 'action', content: 'Extracting key constraint: "Must maintain legacy SAP connector"' },
      { id: 'm3', timestamp: '14:22:31', type: 'output', content: 'Customer requirements payload verified and staged for Analysis' },
    ],
    history: [
      { id: 'h1', timestamp: '14:20:00', action: 'Parsed Apex RFP Document (34 pages)', duration: '1.4s', status: 'completed' },
      { id: 'h2', timestamp: '14:15:10', action: 'Domain reputational validation', duration: '420ms', status: 'completed' },
      { id: 'h3', timestamp: '14:10:45', action: 'Extracted contact hierarchy: 4 stakeholders', duration: '610ms', status: 'completed' },
    ],
    details: {
      recordsProcessed: {
        processed: 14,
        total: 16,
        fileType: 'PDF / DOCX / JSON',
        sources: ['Apex_Operations_RFP_v3.pdf', 'Security_Checklist_2026.xlsx', 'HubSpot_Company_3902.json', 'Billing_Notes_Q3.txt']
      },
      customerRequirements: {
        client: 'Apex Logistics Global',
        tier: 'Enterprise Growth Tier',
        budgetRange: '$25,000 - $35,000',
        timeline: '6 Weeks Turnaround',
        keyItems: [
          'Real-time automated inventory sync',
          'Custom webhook routing to SAP HANA',
          '50 user seats with RBAC security',
          '99.9% uptime SLA compliance'
        ]
      }
    }
  },
  {
    id: 'analysis',
    order: 2,
    title: 'ANALYSIS AGENT',
    role: 'Feasibility Calculation & Cost Modeling',
    status: 'processing',
    statusLabel: 'Processing',
    currentActivity: 'ANALYZING REQUIREMENTS',
    progress: 72,
    tokenCount: '6.1k tokens/s',
    latency: '88ms',
    icon: 'Cpu',
    accentColor: '#5A7AA8',
    summary: 'Cross-evaluates workload scope against server bandwidth, engineering hours, and operational margins.',
    tools: [
      { name: 'Cost Estimator v4', category: 'Financial', status: 'active', iconName: 'DollarSign' },
      { name: 'Risk Scoring Engine', category: 'Compliance', status: 'active', iconName: 'Shield' },
      { name: 'Resource Allocator', category: 'Operations', status: 'active', iconName: 'Layers' },
      { name: 'Monte Carlo Modeler', category: 'Simulation', status: 'standby', iconName: 'BarChart' },
    ],
    metrics: [
      { label: 'Feasibility', value: '94.2%', change: '+2.1%', isPositive: true },
      { label: 'Est. Cost', value: '$18,400', change: '-4.5%', isPositive: true },
      { label: 'Projected Margin', value: '38.5%' },
    ],
    recentMessages: [
      { id: 'm4', timestamp: '14:22:35', type: 'info', content: 'Received payload from Research Agent: 4 core constraints' },
      { id: 'm5', timestamp: '14:22:48', type: 'action', content: 'Running 10,000 Monte Carlo cost-variance simulations' },
      { id: 'm6', timestamp: '14:23:01', type: 'output', content: 'Calculated optimal pricing floor: $29,500 at 38.5% net margin' },
    ],
    history: [
      { id: 'h4', timestamp: '14:21:10', action: 'Simulation #MC-9081 completed', duration: '820ms', status: 'completed' },
      { id: 'h5', timestamp: '14:18:22', action: 'API rate-limit stress calculation', duration: '340ms', status: 'completed' },
      { id: 'h6', timestamp: '14:14:00', action: 'AWS/GCP infrastructure cost lookup', duration: '180ms', status: 'completed' },
    ],
    details: {
      feasibilityScore: 94.2,
      estimatedCost: 18400,
      projectedMargin: '38.5%',
      riskScore: 'Low (0.12)',
      costBreakdown: [
        { category: 'Dev Ops', amount: 8200, percentage: 44 },
        { category: 'Infra Cloud', amount: 4800, percentage: 26 },
        { category: 'Support SLA', amount: 3100, percentage: 17 },
        { category: 'Buffer', amount: 2300, percentage: 13 },
      ],
      feasibilityInsights: [
        'Team capacity confirmed across Q4 sprint cycles',
        'Direct SAP HANA pre-built connector reduces dev time by 35%',
        'Low integration risk; zero schema migrations required'
      ]
    }
  },
  {
    id: 'sales',
    order: 3,
    title: 'SALES & WRITING AGENT',
    role: 'Proposal Generation & Quote Drafting',
    status: 'composing',
    statusLabel: 'Composing',
    currentActivity: 'PREPARING QUOTATION',
    progress: 64,
    tokenCount: '5.4k tokens/s',
    latency: '65ms',
    icon: 'FileText',
    accentColor: '#A8B8D8',
    summary: 'Generates branded sales proposals, client-ready itemized quotations, and persuasive personalized cover letters.',
    tools: [
      { name: 'Proposal Synthesizer', category: 'Content', status: 'active', iconName: 'FileEdit' },
      { name: 'Tone Optimizer', category: 'Styling', status: 'active', iconName: 'Sliders' },
      { name: 'Quotation Formatter', category: 'Billing', status: 'active', iconName: 'Tag' },
      { name: 'Email Composer', category: 'Outreach', status: 'active', iconName: 'Mail' },
    ],
    metrics: [
      { label: 'Quote Total', value: '$29,500', change: 'Target Tier', isPositive: true },
      { label: 'Version', value: 'v2.1-draft' },
      { label: 'Words Generated', value: '1,420' },
    ],
    recentMessages: [
      { id: 'm7', timestamp: '14:23:05', type: 'info', content: 'Feasibility floor received: $18,400 with recommended sell $29,500' },
      { id: 'm8', timestamp: '14:23:14', type: 'action', content: 'Drafting Executive Summary tailored for Marcus Vance, VP Ops' },
      { id: 'm9', timestamp: '14:23:25', type: 'output', content: '3-tier pricing schedule generated: Core / Enterprise / Dedicated' },
    ],
    history: [
      { id: 'h7', timestamp: '14:22:50', action: 'Generated itemized pricing schedule', duration: '950ms', status: 'completed' },
      { id: 'h8', timestamp: '14:19:30', action: 'Composed technical appendix B', duration: '1.2s', status: 'completed' },
      { id: 'h9', timestamp: '14:16:12', action: 'Rendered PDF preview watermark', duration: '410ms', status: 'completed' },
    ],
    details: {
      quotationVersion: 'v2.1-draft',
      quotationHash: '#8F9A2B',
      quotationTotal: 29500,
      proposalSections: [
        { title: 'Executive Summary', words: 380, status: 'ready' },
        { title: 'Technical Architecture & SAP Sync', words: 520, status: 'ready' },
        { title: 'Pricing & Milestone Breakdown', words: 290, status: 'draft' },
        { title: 'Service Level Agreement (99.9%)', words: 230, status: 'ready' }
      ],
      emailDraft: {
        recipient: 'marcus.vance@apexlogistics.com',
        subject: 'SmallBiz AI x Apex: Automated Inventory Sync Proposal (Quote #SB-2026-884)',
        preview: 'Hi Marcus, following our analysis of your 50-seat inventory dispatch specifications, our team has architected a dedicated sync engine...'
      }
    }
  },
  {
    id: 'operations',
    order: 4,
    title: 'OPERATIONS AGENT',
    role: 'Policy Validation & Automated Dispatch',
    status: 'finalizing',
    statusLabel: 'Finalizing',
    currentActivity: 'EXECUTING WORKFLOW',
    progress: 94,
    tokenCount: '3.1k tokens/s',
    latency: '34ms',
    icon: 'ShieldCheck',
    accentColor: '#C8D4F0',
    summary: 'Audits quote compliance against financial tolerances, registers tracking tickets in Jira, and stages dispatch.',
    tools: [
      { name: 'Compliance Guardrail', category: 'Governance', status: 'active', iconName: 'Shield' },
      { name: 'Jira Task Dispatcher', category: 'Workflow', status: 'active', iconName: 'CheckSquare' },
      { name: 'Stripe Invoice Stager', category: 'Finance', status: 'active', iconName: 'CreditCard' },
      { name: 'Slack Ops Bot', category: 'Alerts', status: 'active', iconName: 'Bell' },
    ],
    metrics: [
      { label: 'Confidence', value: '98.4%', change: 'High', isPositive: true },
      { label: 'Checklist', value: '3 / 4 Passed' },
      { label: 'Auto-Dispatch', value: 'Armed' },
    ],
    recentMessages: [
      { id: 'm10', timestamp: '14:23:30', type: 'info', content: 'Proposal payload received from Sales Agent (#8F9A2B)' },
      { id: 'm11', timestamp: '14:23:39', type: 'action', content: 'Validating against SOC2 Compliance checklist & margin thresholds' },
      { id: 'm12', timestamp: '14:23:50', type: 'output', content: 'Automated tasks staged: Jira #OP-441, Stripe Invoice draft ready' },
    ],
    history: [
      { id: 'h10', timestamp: '14:23:45', action: 'Created Jira Epic #OP-441 with 5 sub-tasks', duration: '510ms', status: 'completed' },
      { id: 'h11', timestamp: '14:20:15', action: 'Staged Stripe customer invoice #INV-9901', duration: '290ms', status: 'completed' },
      { id: 'h12', timestamp: '14:17:40', action: 'Dispatched status digest to #ops-leads channel', duration: '140ms', status: 'completed' },
    ],
    details: {
      confidenceScore: 98.4,
      approvalChecklist: [
        { id: 'c1', label: 'SOC2 & Data Retention Policy Verified', checked: true, required: true },
        { id: 'c2', label: 'Margin Threshold > 35% Validated', checked: true, required: true },
        { id: 'c3', label: 'Engineering Sprint Capacity Locked', checked: true, required: true },
        { id: 'c4', label: 'Client Electronic Signature Captured', checked: false, required: false }
      ],
      tasksCreated: [
        { id: 't1', title: 'Jira #OP-441: Provision dedicated SAP worker', assignedTo: 'Platform Bot', status: 'dispatched' },
        { id: 't2', title: 'Stripe: Draft invoice $29,500 (Net 30)', assignedTo: 'Finance Sync', status: 'dispatched' },
        { id: 't3', title: 'Slack: #ops-leads dispatch notification', assignedTo: 'Notification Hub', status: 'dispatched' },
        { id: 't4', title: 'DocuSign: Envelope packaging for Apex', assignedTo: 'Signing Service', status: 'syncing' }
      ],
      decisionOptions: [
        { id: 'approve', label: 'Approve & Dispatch Workflow', primary: true },
        { id: 'review', label: 'Request Human Review', primary: false }
      ]
    }
  }
];

export const INITIAL_LOGS: LogEntry[] = [
  { id: 'l1', timestamp: '14:23:50.12', agentId: 'operations', agentName: 'OPERATIONS AGENT', level: 'info', message: 'Workflow checkpoint passed: 3 of 4 criteria met. Ready for manual/auto dispatch.' },
  { id: 'l2', timestamp: '14:23:45.88', agentId: 'operations', agentName: 'OPERATIONS AGENT', level: 'success', message: 'Jira Epic #OP-441 generated with 4 child sub-tasks.' },
  { id: 'l3', timestamp: '14:23:25.04', agentId: 'sales', agentName: 'SALES & WRITING AGENT', level: 'info', message: 'Quote generated: $29,500 total (v2.1-draft, Hash #8F9A2B).' },
  { id: 'l4', timestamp: '14:23:01.32', agentId: 'analysis', agentName: 'ANALYSIS AGENT', level: 'info', message: 'Calculated project feasibility index: 94.2% across 3 operational dimensions.' },
  { id: 'l5', timestamp: '14:22:31.95', agentId: 'research', agentName: 'BUSINESS RESEARCH AGENT', level: 'success', message: 'Extracted 4 mandatory client requirements from Apex RFP v3.pdf.' },
  { id: 'l6', timestamp: '14:22:04.10', agentId: 'research', agentName: 'BUSINESS RESEARCH AGENT', level: 'info', message: 'Inbound inquiry #INQ-8892 received from web form.' },
  { id: 'l7', timestamp: '14:21:40.02', agentId: 'analysis', agentName: 'ANALYSIS AGENT', level: 'debug', message: 'Warm cache hit on SAP HANA connector latency matrix (14ms).' },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Operations Agent Pending Dispatch',
    description: 'Quote #SB-2026-884 for Apex Logistics is awaiting final release authorization.',
    time: '2m ago',
    read: false,
    type: 'approval',
    agentId: 'operations'
  },
  {
    id: 'n2',
    title: 'Research Agent Finished Ingestion',
    description: '14 document sources scanned and indexed with 99.4% extraction accuracy.',
    time: '5m ago',
    read: false,
    type: 'agent',
    agentId: 'research'
  },
  {
    id: 'n3',
    title: 'System Health Optimal',
    description: 'All 4 agent nodes running at 42ms median latency. Engine v2.4 stable.',
    time: '18m ago',
    read: true,
    type: 'system'
  }
];

