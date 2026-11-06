from typing import Optional
from pydantic import BaseModel

class TaskUpdate(BaseModel):
    status: Optional[str] = None
    title: Optional[str] = None
    isChecked: Optional[bool] = None

class TaskResponse(BaseModel):
    id: str
    title: str
    assignedTo: str
    status: str
    isChecklistItem: bool = False
    isChecked: bool = False
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None

    class Config:
        from_attributes = True

