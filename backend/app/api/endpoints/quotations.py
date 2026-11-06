from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.quotation import Quotation
from app.schemas.quotation import QuotationCreate, QuotationResponse, CostCategory
from app.services.quotation_service import quotation_service

router = APIRouter()

@router.post("", response_model=QuotationResponse)
def create_quotation(data: QuotationCreate, db: Session = Depends(get_db)):
    """
    Triggers the Sales & Writing Agent to calculate itemized pricing and quotation schedule.
    """
    quote = quotation_service.create_quotation(db, data.inquiryId or "INQ-INIT", data.client, data.totalAmount)
    return QuotationResponse(
        id=quote.id,
        inquiryId=quote.inquiry_id,
        version=quote.version,
        hashCode=quote.hash_code,
        totalAmount=quote.total_amount,
        scheduleTier=quote.schedule_tier,
        feasibilityScore=quote.feasibility_score,
        projectedMargin=quote.projected_margin,
        riskScore=quote.risk_score,
        costBreakdown=[
            CostCategory(category=b["category"], amount=b["amount"], percentage=b["percentage"])
            for b in quote.breakdown
        ],
        createdAt=quote.created_at.isoformat()
    )

@router.get("", response_model=List[QuotationResponse])
def get_quotations(db: Session = Depends(get_db)):
    """
    Retrieves all generated quotations from the database.
    """
    quotes = db.query(Quotation).order_by(Quotation.created_at.desc()).all()
    return [
        QuotationResponse(
            id=q.id,
            inquiryId=q.inquiry_id,
            version=q.version,
            hashCode=q.hash_code,
            totalAmount=q.total_amount,
            scheduleTier=q.schedule_tier,
            feasibilityScore=q.feasibility_score,
            projectedMargin=q.projected_margin,
            riskScore=q.risk_score,
            costBreakdown=[
                CostCategory(category=b["category"], amount=b["amount"], percentage=b["percentage"])
                for b in q.breakdown
            ],
            createdAt=q.created_at.isoformat()
        ) for q in quotes
    ]

@router.get("/{quote_id}", response_model=QuotationResponse)
def get_quotation(quote_id: str, db: Session = Depends(get_db)):
    """
    Retrieves a single quotation by its ID.
    """
    q = db.query(Quotation).filter(Quotation.id == quote_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Quotation not found")
    return QuotationResponse(
        id=q.id,
        inquiryId=q.inquiry_id,
        version=q.version,
        hashCode=q.hash_code,
        totalAmount=q.total_amount,
        scheduleTier=q.schedule_tier,
        feasibilityScore=q.feasibility_score,
        projectedMargin=q.projected_margin,
        riskScore=q.risk_score,
        costBreakdown=[
            CostCategory(category=b["category"], amount=b["amount"], percentage=b["percentage"])
            for b in q.breakdown
        ],
        createdAt=q.created_at.isoformat()
    )


