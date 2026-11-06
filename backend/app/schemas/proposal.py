from typing import List, Optional
from pydantic import BaseModel, Field

class ProposalSection(BaseModel):
    title: str
    words: int
    status: str

class ProposalCreate(BaseModel):
    quotationId: Optional[str] = None
    recipientEmail: str
    subject: str

class ProposalResponse(BaseModel):
    id: str
    quotationId: Optional[str]
    recipientEmail: str
    subject: str
    previewBody: str
    sections: List[ProposalSection]
    createdAt: str

    class Config:
        from_attributes = True

