import uuid
from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.proposal import Proposal
from app.schemas.proposal import ProposalCreate, ProposalResponse, ProposalSection

router = APIRouter()

@router.post("", response_model=ProposalResponse)
def create_proposal(data: ProposalCreate, db: Session = Depends(get_db)):
    """
    Generates structured proposal sections and draft client communications.
    """
    prop = Proposal(
        id=f"PRP-{uuid.uuid4().hex[:6].upper()}",
        quotation_id=data.quotationId,
        recipient_email=data.recipientEmail,
        subject=data.subject,
        preview_body=f"Draft proposal synthesized for {data.recipientEmail}."
    )
    sections = [
        {"title": "Executive Summary", "words": 380, "status": "ready"},
        {"title": "Technical Architecture & Operational Workflow", "words": 520, "status": "ready"},
        {"title": "Pricing & Milestone Breakdown", "words": 290, "status": "ready"},
        {"title": "Service Level Agreement (99.9%)", "words": 230, "status": "ready"}
    ]
    prop.sections = sections
    db.add(prop)
    db.commit()
    db.refresh(prop)

    return ProposalResponse(
        id=prop.id,
        quotationId=prop.quotation_id,
        recipientEmail=prop.recipient_email,
        subject=prop.subject,
        previewBody=prop.preview_body,
        sections=[ProposalSection(title=s["title"], words=s["words"], status=s["status"]) for s in prop.sections],
        createdAt=prop.created_at.isoformat()
    )

@router.get("", response_model=List[ProposalResponse])
def get_proposals(db: Session = Depends(get_db)):
    """
    Retrieves all generated proposals from the database.
    """
    props = db.query(Proposal).order_by(Proposal.created_at.desc()).all()
    return [
        ProposalResponse(
            id=p.id,
            quotationId=p.quotation_id,
            recipientEmail=p.recipient_email,
            subject=p.subject,
            previewBody=p.preview_body,
            sections=[ProposalSection(title=s["title"], words=s["words"], status=s["status"]) for s in p.sections],
            createdAt=p.created_at.isoformat()
        ) for p in props
    ]

@router.get("/{proposal_id}", response_model=ProposalResponse)
def get_proposal(proposal_id: str, db: Session = Depends(get_db)):
    """
    Retrieves a single proposal by its ID.
    """
    p = db.query(Proposal).filter(Proposal.id == proposal_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Proposal not found")
    return ProposalResponse(
        id=p.id,
        quotationId=p.quotation_id,
        recipientEmail=p.recipient_email,
        subject=p.subject,
        previewBody=p.preview_body,
        sections=[ProposalSection(title=s["title"], words=s["words"], status=s["status"]) for s in p.sections],
        createdAt=p.created_at.isoformat()
    )


