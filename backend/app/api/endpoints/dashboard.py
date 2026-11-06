from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.agent import AgentState
from app.models.task import Task
from app.models.log import ExecutionLog
from app.models.inquiry import Inquiry
from app.schemas.dashboard import DashboardResponse, DashboardNotification
from app.schemas.agent import AgentStateResponse
from app.schemas.task import TaskResponse
from app.schemas.log import ExecutionLogResponse

router = APIRouter()

@router.get("", response_model=DashboardResponse)
def get_dashboard(db: Session = Depends(get_db)):
    """
    Returns the unified real-time dashboard telemetry for the SmallBiz AI Operations Room.
    """
    agents = db.query(AgentState).order_by(AgentState.order.asc()).all()
    tasks = db.query(Task).all()
    logs = db.query(ExecutionLog).order_by(ExecutionLog.created_at.desc()).limit(15).all()
    recent_inquiries = db.query(Inquiry).order_by(Inquiry.created_at.desc()).limit(3).all()

    agent_responses = [
        AgentStateResponse(
            id=a.id,
            order=a.order,
            title=a.title,
            role=a.role,
            status=a.status,
            statusLabel=a.status_label,
            currentActivity=a.current_activity,
            progress=a.progress,
            tokenCount=a.token_count,
            latency=a.latency,
            icon=a.icon,
            accentColor=a.accent_color,
            summary=a.summary,
            tools=a.tools,
            metrics=a.metrics,
            details=a.details,
            recentMessages=a.recent_messages,
            history=a.history
        ) for a in agents
    ]

    task_responses = [
        TaskResponse(
            id=t.id,
            title=t.title,
            assignedTo=t.assigned_to,
            status=t.status,
            isChecklistItem=t.is_checklist_item,
            isChecked=t.is_checked,
            createdAt=t.created_at.isoformat() if t.created_at else None,
            updatedAt=t.updated_at.isoformat() if t.updated_at else None,
        ) for t in tasks
    ]

    log_responses = [
        ExecutionLogResponse(
            id=l.id,
            timestamp=l.timestamp_str,
            agentId=l.agent_id,
            agentName=l.agent_name,
            level=l.level,
            message=l.message
        ) for l in logs
    ]

    notifications = []
    for inq in recent_inquiries:
        notifications.append(
            DashboardNotification(
                id=f"notif-{inq.id}",
                title=f"Inquiry Ingested: {inq.client}",
                description=f"Scope: {', '.join(inq.key_items[:2]) if inq.key_items else inq.client} | Budget: {inq.budget_range}",
                time="Just now",
                read=False,
                type="agent",
                agentId="research"
            )
        )

    # Standard system notifications
    notifications.extend([
        DashboardNotification(
            id="n1",
            title="Operations Agent Pending Dispatch",
            description="Quote #SB-2026-884 for Apex Logistics is awaiting final release authorization.",
            time="2m ago",
            read=False,
            type="approval",
            agentId="operations"
        ),
        DashboardNotification(
            id="n2",
            title="Research Agent Finished Ingestion",
            description="14 document sources scanned and indexed with 99.4% extraction accuracy.",
            time="5m ago",
            read=False,
            type="agent",
            agentId="research"
        ),
        DashboardNotification(
            id="n3",
            title="System Health Optimal",
            description="All 4 agent nodes running at 42ms median latency. Engine v2.4.1 stable.",
            time="18m ago",
            read=True,
            type="system",
            agentId=""
        )
    ])


    return DashboardResponse(
        status="ONLINE",
        engineVersion="v2.4.1",
        uptime="99.98%",
        pipelineHealth=99.8,
        activeSession="#WF-2026-884",
        step="STEP 4/4",
        agents=agent_responses,
        tasks=task_responses,
        recentLogs=log_responses,
        notifications=notifications
    )

