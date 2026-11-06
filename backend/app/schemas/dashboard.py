from typing import List, Dict, Any
from pydantic import BaseModel
from app.schemas.agent import AgentStateResponse
from app.schemas.task import TaskResponse
from app.schemas.log import ExecutionLogResponse

class DashboardNotification(BaseModel):
    id: str
    title: str
    description: str
    time: str
    read: bool
    type: str
    agentId: str = ""

class DashboardResponse(BaseModel):
    status: str = "ONLINE"
    engineVersion: str = "v2.4.1"
    uptime: str = "99.98%"
    pipelineHealth: float = 99.8
    activeSession: str = "#WF-2026-884"
    step: str = "STEP 4/4"
    agents: List[AgentStateResponse]
    tasks: List[TaskResponse]
    recentLogs: List[ExecutionLogResponse]
    notifications: List[DashboardNotification]

