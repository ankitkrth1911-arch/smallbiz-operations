from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class CostCategory(BaseModel):
    category: str
    amount: float
    percentage: float

class QuotationCreate(BaseModel):
    inquiryId: Optional[str] = None
    client: str = "Apex Logistics Global"
    targetTier: str = "3-Tier Growth"
    totalAmount: Optional[float] = None

class QuotationResponse(BaseModel):
    id: str
    inquiryId: Optional[str]
    version: str
    hashCode: str
    totalAmount: float
    scheduleTier: str
    feasibilityScore: float
    projectedMargin: str
    riskScore: str
    costBreakdown: List[CostCategory]
    createdAt: str

    class Config:
        from_attributes = True

