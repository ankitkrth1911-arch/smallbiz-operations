from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class AgentToolSchema(BaseModel):
    name: str
    category: str
    status: str
    iconName: str

class AgentMetricSchema(BaseModel):
    label: str
    value: Any
    change: Optional[str] = None
    isPositive: Optional[bool] = None

class AgentMessageSchema(BaseModel):
    id: str
    timestamp: str
    type: str
    content: str

class HistoryItemSchema(BaseModel):
    id: str
    timestamp: str
    action: str
    duration: str
    status: str

class AgentStateResponse(BaseModel):
    id: str
    order: int
    title: str
    role: str
    status: str
    statusLabel: str
    currentActivity: str
    progress: int
    tokenCount: str
    latency: str
    icon: str
    accentColor: str
    summary: str
    tools: List[AgentToolSchema] = []
    metrics: List[AgentMetricSchema] = []
    details: Dict[str, Any] = {}
    recentMessages: List[AgentMessageSchema] = []
    history: List[HistoryItemSchema] = []

    class Config:
        from_attributes = True

