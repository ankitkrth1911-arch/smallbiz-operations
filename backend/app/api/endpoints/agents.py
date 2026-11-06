from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.agent import AgentState
from app.schemas.agent import AgentStateResponse

router = APIRouter()

@router.get("", response_model=List[AgentStateResponse])
def get_agents(db: Session = Depends(get_db)):
    """
    Returns the real-time operational state of all registered AI agents in the operations room.
    """
    agents = db.query(AgentState).order_by(AgentState.order.asc()).all()
    return [
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

