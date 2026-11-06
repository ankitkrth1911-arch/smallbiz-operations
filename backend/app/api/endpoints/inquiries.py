from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.inquiry import InquiryCreate, InquiryResponse
from app.services.inquiry_service import inquiry_service
from app.models.inquiry import Inquiry
from app.models.agent import AgentState
from app.models.log import ExecutionLog

router = APIRouter()

@router.post("", response_model=InquiryResponse)
def create_inquiry(data: InquiryCreate, db: Session = Depends(get_db)):
    """
    Ingests an inbound business RFP or customer inquiry into the Operations Room.
    Updates the Business Research Agent in SQLite and triggers an agent handoff.
    """
    inquiry = inquiry_service.process_inquiry(db, data)
    research_agent = db.query(AgentState).filter(AgentState.id == "research").first()
    latest_log = db.query(ExecutionLog).filter(ExecutionLog.agent_id == "research").order_by(ExecutionLog.created_at.desc()).first()

    return InquiryResponse(
        id=inquiry.id,
        client=inquiry.client,
        sourceType=inquiry.source_type,
        status=inquiry.status,
        budgetRange=inquiry.budget_range,
        timeline=inquiry.timeline,
        keyItems=inquiry.key_items,
        createdAt=inquiry.created_at.isoformat(),
        updatedAgent={
            "id": research_agent.id,
            "order": research_agent.order,
            "title": research_agent.title,
            "role": research_agent.role,
            "status": research_agent.status,
            "statusLabel": research_agent.status_label,
            "currentActivity": research_agent.current_activity,
            "progress": research_agent.progress,
            "tokenCount": research_agent.token_count,
            "latency": research_agent.latency,
            "icon": research_agent.icon,
            "accentColor": research_agent.accent_color,
            "summary": research_agent.summary,
            "tools": research_agent.tools,
            "metrics": research_agent.metrics,
            "details": research_agent.details,
            "recentMessages": research_agent.recent_messages,
            "history": research_agent.history
        } if research_agent else None,
        newLog={
            "id": latest_log.id,
            "timestamp": latest_log.timestamp_str,
            "agentId": latest_log.agent_id,
            "agentName": latest_log.agent_name,
            "level": latest_log.level,
            "message": latest_log.message
        } if latest_log else None
    )

@router.get("", response_model=List[InquiryResponse])
def get_inquiries(db: Session = Depends(get_db)):
    """
    Retrieves all inbound business inquiries stored in the database.
    """
    inquiries = db.query(Inquiry).order_by(Inquiry.created_at.desc()).all()
    return [
        InquiryResponse(
            id=i.id,
            client=i.client,
            sourceType=i.source_type,
            status=i.status,
            budgetRange=i.budget_range,
            timeline=i.timeline,
            keyItems=i.key_items,
            createdAt=i.created_at.isoformat()
        ) for i in inquiries
    ]

@router.get("/{inquiry_id}", response_model=InquiryResponse)
def get_inquiry(inquiry_id: str, db: Session = Depends(get_db)):
    """
    Retrieves a single business inquiry by its ID.
    """
    i = db.query(Inquiry).filter(Inquiry.id == inquiry_id).first()
    if not i:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return InquiryResponse(
        id=i.id,
        client=i.client,
        sourceType=i.source_type,
        status=i.status,
        budgetRange=i.budget_range,
        timeline=i.timeline,
        keyItems=i.key_items,
        createdAt=i.created_at.isoformat()
    )


