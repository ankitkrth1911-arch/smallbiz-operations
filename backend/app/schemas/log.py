from pydantic import BaseModel

class ExecutionLogResponse(BaseModel):
    id: str
    timestamp: str
    agentId: str
    agentName: str
    level: str
    message: str

    class Config:
        from_attributes = True

