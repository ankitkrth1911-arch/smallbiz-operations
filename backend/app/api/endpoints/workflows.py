from datetime import datetime
from typing import Optional, List
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.agent import AgentState
from app.models.log import ExecutionLog
from app.services.operations_service import operations_service
from app.schemas.agent import AgentStateResponse
from app.schemas.log import ExecutionLogResponse

router = APIRouter()

class WorkflowRunInput(BaseModel):
    pipelineId: Optional[str] = "#WF-2026-884"
    inquiryId: Optional[str] = None
    autoDispatch: bool = True

class WorkflowRunOutput(BaseModel):
    success: bool
    pipelineId: str
    message: str
    agents: List[AgentStateResponse]
    newLogs: List[ExecutionLogResponse]
    timestamp: str

@router.post("/run", response_model=WorkflowRunOutput)
def run_workflow(payload: WorkflowRunInput, db: Session = Depends(get_db)):
    """
    Executes or advances the multi-agent orchestration pipeline.
    Validates consensus, triggers operational tasks, and persists state to SQLite.
    """
    operations_service.execute_workflow(
        db,
        pipeline_id=payload.pipelineId or "#WF-2026-884",
        auto_dispatch=payload.autoDispatch,
        inquiry_id=payload.inquiryId
    )

    agents = db.query(AgentState).order_by(AgentState.order.asc()).all()
    logs = db.query(ExecutionLog).order_by(ExecutionLog.created_at.desc()).limit(10).all()

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

    return WorkflowRunOutput(
        success=True,
        pipelineId=payload.pipelineId or "#WF-2026-884",
        message="Workflow execution dispatched across all 4 agents",
        agents=agent_responses,
        newLogs=log_responses,
        timestamp=datetime.utcnow().isoformat()
    )

