import os
import json
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base, SessionLocal
from app.api.router import api_router
from app.models import (
    User,
    AgentState,
    Inquiry,
    Proposal,
    Quotation,
    Task,
    ExecutionLog,
)
from app.services.switch_service import switch_service
from app.services.auth_service import auth_service

def seed_database():
    """Seeds the SQLite database with initial agent states, tasks, and telemetry if empty."""
    db = SessionLocal()
    try:
        # Seed default user for authentication
        auth_service.seed_default_user(db)

        agent_count = db.query(AgentState).count()
        if agent_count == 0:
            initial_agents = [
                AgentState(
                    id="research",
                    order=1,
                    title="BUSINESS RESEARCH AGENT",
                    role="Inbound Intelligence & Document Parsing",
                    status="active",
                    status_label="Active",
                    current_activity="SCANNING BUSINESS INQUIRY",
                    progress=88,
                    token_count="4.8k tokens/s",
                    latency="42ms",
                    icon="Search",
                    accent_color="#668B83",
                    summary="Receives business inquiries, parses unstructured RFP docs, and extracts core operational requirements.",
                    tools_json=json.dumps([
                        {"name": "Document Parser OCR", "category": "Ingestion", "status": "active", "iconName": "FileText"},
                        {"name": "HubSpot CRM Sync", "category": "Database", "status": "active", "iconName": "Database"},
                        {"name": "Web Entity Validator", "category": "Enrichment", "status": "active", "iconName": "Globe"},
                        {"name": "Semantic Tokenizer", "category": "NLP", "status": "standby", "iconName": "Cpu"}
                    ]),
                    metrics_json=json.dumps([
                        {"label": "Sources Scanned", "value": "14 / 16", "change": "+4 docs", "isPositive": True},
                        {"label": "Extraction Acc.", "value": "99.4%", "change": "+0.8%", "isPositive": True},
                        {"label": "Confidence", "value": "96.2%"}
                    ]),
                    details_json=json.dumps({
                        "recordsProcessed": {
                            "processed": 14,
                            "total": 16,
                            "fileType": "PDF / DOCX / JSON",
                            "sources": ["Apex_Operations_RFP_v3.pdf", "Security_Checklist_2026.xlsx", "HubSpot_Company_3902.json", "Billing_Notes_Q3.txt"]
                        },
                        "customerRequirements": {
                            "client": "Apex Logistics Global",
                            "tier": "Enterprise Growth Tier",
                            "budgetRange": "$25,000 - $35,000",
                            "timeline": "6 Weeks Turnaround",
                            "keyItems": [
                                "Real-time automated inventory sync",
                                "Custom webhook routing to SAP HANA",
                                "50 user seats with RBAC security",
                                "99.9% uptime SLA compliance"
                            ]
                        }
                    }),
                    recent_messages_json=json.dumps([
                        {"id": "m1", "timestamp": "14:22:04", "type": "info", "content": "Inbound inquiry #INQ-8892 ingested from Webhook /forms/rfp"},
                        {"id": "m2", "timestamp": "14:22:18", "type": "action", "content": "Extracting key constraint: 'Must maintain legacy SAP connector'"},
                        {"id": "m3", "timestamp": "14:22:31", "type": "output", "content": "Customer requirements payload verified and staged for Analysis"}
                    ]),
                    history_json=json.dumps([
                        {"id": "h1", "timestamp": "14:20:00", "action": "Parsed Apex RFP Document (34 pages)", "duration": "1.4s", "status": "completed"},
                        {"id": "h2", "timestamp": "14:15:10", "action": "Domain reputational validation", "duration": "420ms", "status": "completed"}
                    ])
                ),
                AgentState(
                    id="analysis",
                    order=2,
                    title="ANALYSIS AGENT",
                    role="Feasibility Calculation & Cost Modeling",
                    status="processing",
                    status_label="Processing",
                    current_activity="ANALYZING REQUIREMENTS",
                    progress=72,
                    token_count="6.1k tokens/s",
                    latency="88ms",
                    icon="Cpu",
                    accent_color="#6685AF",
                    summary="Cross-evaluates workload scope against server bandwidth, engineering hours, and operational margins.",
                    tools_json=json.dumps([
                        {"name": "Cost Estimator v4", "category": "Financial", "status": "active", "iconName": "DollarSign"},
                        {"name": "Risk Scoring Engine", "category": "Compliance", "status": "active", "iconName": "Shield"},
                        {"name": "Resource Allocator", "category": "Operations", "status": "active", "iconName": "Layers"},
                        {"name": "Monte Carlo Modeler", "category": "Simulation", "status": "standby", "iconName": "BarChart"}
                    ]),
                    metrics_json=json.dumps([
                        {"label": "Feasibility", "value": "94.2%", "change": "+2.1%", "isPositive": True},
                        {"label": "Est. Cost", "value": "$18,400", "change": "-4.5%", "isPositive": True},
                        {"label": "Projected Margin", "value": "38.5%"}
                    ]),
                    details_json=json.dumps({
                        "feasibilityScore": 94.2,
                        "estimatedCost": 18400,
                        "projectedMargin": "38.5%",
                        "riskScore": "Low (0.12)",
                        "costBreakdown": [
                            {"category": "DevOps", "amount": 8200, "percentage": 44},
                            {"category": "Infra Cloud", "amount": 4800, "percentage": 26},
                            {"category": "Support SLA", "amount": 3100, "percentage": 17},
                            {"category": "Buffer", "amount": 2300, "percentage": 13}
                        ],
                        "feasibilityInsights": [
                            "Team capacity confirmed across Q4 sprint cycles",
                            "Direct SAP HANA pre-built connector reduces dev time by 35%",
                            "Low integration risk; zero schema migrations required"
                        ]
                    }),
                    recent_messages_json=json.dumps([
                        {"id": "m4", "timestamp": "14:22:35", "type": "info", "content": "Received payload from Research Agent: 4 core constraints"},
                        {"id": "m5", "timestamp": "14:22:48", "type": "action", "content": "Running 10,000 Monte Carlo cost-variance simulations"}
                    ]),
                    history_json=json.dumps([
                        {"id": "h4", "timestamp": "14:21:10", "action": "Simulation #MC-9081 completed", "duration": "820ms", "status": "completed"}
                    ])
                ),
                AgentState(
                    id="sales",
                    order=3,
                    title="SALES & WRITING AGENT",
                    role="Proposal Generation & Quote Drafting",
                    status="composing",
                    status_label="Composing",
                    current_activity="PREPARING QUOTATION",
                    progress=64,
                    token_count="5.4k tokens/s",
                    latency="65ms",
                    icon="FileText",
                    accent_color="#B18B62",
                    summary="Generates branded sales proposals, client-ready itemized quotations, and persuasive personalized cover letters.",
                    tools_json=json.dumps([
                        {"name": "Proposal Synthesizer", "category": "Content", "status": "active", "iconName": "FileEdit"},
                        {"name": "Tone Optimizer", "category": "Styling", "status": "active", "iconName": "Sliders"},
                        {"name": "Quotation Formatter", "category": "Billing", "status": "active", "iconName": "Tag"},
                        {"name": "Email Composer", "category": "Outreach", "status": "active", "iconName": "Mail"}
                    ]),
                    metrics_json=json.dumps([
                        {"label": "Quote Total", "value": "$29,500", "change": "Target Tier", "isPositive": True},
                        {"label": "Version", "value": "v2.1-draft"},
                        {"label": "Words Generated", "value": "1,420"}
                    ]),
                    details_json=json.dumps({
                        "quotationVersion": "v2.1-draft",
                        "quotationHash": "#8F9A2B",
                        "quotationTotal": 29500,
                        "proposalSections": [
                            {"title": "Executive Summary", "words": 380, "status": "ready"},
                            {"title": "Technical Architecture & SAP Sync", "words": 520, "status": "ready"},
                            {"title": "Pricing & Milestone Breakdown", "words": 290, "status": "ready"},
                            {"title": "Service Level Agreement (99.9%)", "words": 230, "status": "ready"}
                        ],
                        "emailDraft": {
                            "recipient": "marcus.vance@apexlogistics.com",
                            "subject": "SmallBiz AI x Apex: Automated Inventory Sync Proposal (Quote #SB-2026-884)",
                            "preview": "Hi Marcus, following our analysis of your 50-seat inventory dispatch specifications, our team has architected a dedicated sync engine..."
                        }
                    }),
                    recent_messages_json=json.dumps([
                        {"id": "m7", "timestamp": "14:23:05", "type": "info", "content": "Feasibility floor received: $18,400 with recommended sell $29,500"}
                    ]),
                    history_json=json.dumps([
                        {"id": "h7", "timestamp": "14:22:50", "action": "Generated itemized pricing schedule", "duration": "950ms", "status": "completed"}
                    ])
                ),
                AgentState(
                    id="operations",
                    order=4,
                    title="OPERATIONS AGENT",
                    role="Policy Validation & Automated Dispatch",
                    status="finalizing",
                    status_label="Finalizing",
                    current_activity="EXECUTING WORKFLOW",
                    progress=94,
                    token_count="3.1k tokens/s",
                    latency="34ms",
                    icon="ShieldCheck",
                    accent_color="#9383A6",
                    summary="Audits quote compliance against financial tolerances, registers tracking tickets in Jira, and stages dispatch.",
                    tools_json=json.dumps([
                        {"name": "Compliance Guardrail", "category": "Governance", "status": "active", "iconName": "Shield"},
                        {"name": "Jira Task Dispatcher", "category": "Workflow", "status": "active", "iconName": "CheckSquare"},
                        {"name": "Stripe Invoice Stager", "category": "Finance", "status": "active", "iconName": "CreditCard"},
                        {"name": "Slack Ops Bot", "category": "Alerts", "status": "active", "iconName": "Bell"}
                    ]),
                    metrics_json=json.dumps([
                        {"label": "Confidence", "value": "98.4%", "change": "High", "isPositive": True},
                        {"label": "Checklist", "value": "3 / 4 Passed"},
                        {"label": "Auto-Dispatch", "value": "Armed"}
                    ]),
                    details_json=json.dumps({
                        "confidenceScore": 98.4,
                        "approvalChecklist": [
                            {"id": "c1", "label": "SOC2 & Data Retention Policy Verified", "checked": True, "required": True},
                            {"id": "c2", "label": "Margin Threshold > 35% Validated", "checked": True, "required": True},
                            {"id": "c3", "label": "Engineering Sprint Capacity Locked", "checked": True, "required": True},
                            {"id": "c4", "label": "Client Electronic Signature Captured", "checked": False, "required": False}
                        ],
                        "tasksCreated": [
                            {"id": "t1", "title": "Jira #OP-441: Provision dedicated SAP worker", "assignedTo": "Platform Bot", "status": "dispatched"},
                            {"id": "t2", "title": "Stripe: Draft invoice $29,500 (Net 30)", "assignedTo": "Finance Sync", "status": "dispatched"},
                            {"id": "t3", "title": "Slack: #ops-leads dispatch notification", "assignedTo": "Notification Hub", "status": "dispatched"},
                            {"id": "t4", "title": "DocuSign: Envelope packaging for Apex", "assignedTo": "Signing Service", "status": "syncing"}
                        ],
                        "decisionOptions": [
                            {"id": "approve", "label": "Approve & Dispatch Workflow", "primary": True},
                            {"id": "review", "label": "Request Human Review", "primary": False}
                        ]
                    }),
                    recent_messages_json=json.dumps([
                        {"id": "m10", "timestamp": "14:23:30", "type": "info", "content": "Proposal payload received from Sales Agent (#8F9A2B)"}
                    ]),
                    history_json=json.dumps([
                        {"id": "h10", "timestamp": "14:23:45", "action": "Created Jira Epic #OP-441 with 5 sub-tasks", "duration": "510ms", "status": "completed"}
                    ])
                )
            ]
            db.add_all(initial_agents)

        task_count = db.query(Task).count()
        if task_count == 0:
            initial_tasks = [
                Task(id="t1", title="Jira #OP-441: Provision dedicated SAP worker", assigned_to="Platform Bot", status="dispatched"),
                Task(id="t2", title="Stripe: Draft invoice $29,500 (Net 30)", assigned_to="Finance Sync", status="dispatched"),
                Task(id="t3", title="Slack: #ops-leads dispatch notification", assigned_to="Notification Hub", status="dispatched"),
                Task(id="t4", title="DocuSign: Envelope packaging for Apex", assigned_to="Signing Service", status="syncing"),
            ]
            db.add_all(initial_tasks)

        log_count = db.query(ExecutionLog).count()
        if log_count == 0:
            initial_logs = [
                ExecutionLog(id="l1", timestamp_str="14:23:50.12", agent_id="operations", agent_name="OPERATIONS AGENT", level="info", message="Workflow checkpoint passed: 3 of 4 criteria met. Ready for manual/auto dispatch."),
                ExecutionLog(id="l2", timestamp_str="14:23:45.88", agent_id="operations", agent_name="OPERATIONS AGENT", level="success", message="Jira Epic #OP-441 generated with 4 child sub-tasks."),
                ExecutionLog(id="l3", timestamp_str="14:23:25.04", agent_id="sales", agent_name="SALES & WRITING AGENT", level="info", message="Quote generated: $29,500 total (v2.1-draft, Hash #8F9A2B)."),
                ExecutionLog(id="l4", timestamp_str="14:23:01.32", agent_id="analysis", agent_name="ANALYSIS AGENT", level="info", message="Calculated project feasibility index: 94.2% across 3 operational dimensions."),
                ExecutionLog(id="l5", timestamp_str="14:22:31.95", agent_id="research", agent_name="BUSINESS RESEARCH AGENT", level="success", message="Extracted 4 mandatory client requirements from Apex RFP v3.pdf."),
                ExecutionLog(id="l6", timestamp_str="14:22:04.10", agent_id="research", agent_name="BUSINESS RESEARCH AGENT", level="info", message="Inbound inquiry #INQ-8892 received from web form.")
            ]
            db.add_all(initial_logs)

        db.commit()
    finally:
        db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create SQLite tables and seed data
    Base.metadata.create_all(bind=engine)
    seed_database()
    switch_service.initialize_room({"session": "smallbiz-production-bootstrap"})
    yield
    # Shutdown logic if any

app = FastAPI(
    title=settings.APP_NAME,
    description="Multi-Agent Orchestration REST API for SmallBiz AI Operations Room with SQLite and Switch integration.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Central API Router
app.include_router(api_router)

@app.get("/", tags=["Health"])
def root():
    return {
        "status": "online",
        "service": settings.APP_NAME,
        "docs": "/docs",
        "database": engine.dialect.name,
        "agents": 4,
        "switchIntegration": switch_service.is_connected
    }

@app.get("/api/health/db", tags=["Health"])
def health_db():
    from sqlalchemy import text
    db = SessionLocal()
    try:
        val = db.execute(text("SELECT 1;")).scalar()
        if engine.dialect.name == "postgresql":
            tables = db.execute(
                text("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;")
            ).scalars().all()
        else:
            tables = db.execute(
                text("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;")
            ).scalars().all()
        return {
            "status": "connected",
            "dialect": engine.dialect.name,
            "ping": val == 1,
            "tables": tables,
        }
    except Exception as e:
        return {
            "status": "error",
            "dialect": engine.dialect.name,
            "error": type(e).__name__,
        }
    finally:
        db.close()

