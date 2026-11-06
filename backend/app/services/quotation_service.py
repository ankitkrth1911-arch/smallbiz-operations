import uuid
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.quotation import Quotation
from app.models.proposal import Proposal
from app.models.agent import AgentState
from app.models.log import ExecutionLog
from app.services.switch_service import switch_service

class QuotationService:
    def create_quotation(self, db: Session, inquiry_id: str, client: str, requested_amount: float = None) -> Quotation:
        quote_id = f"QTE-{uuid.uuid4().hex[:6].upper()}"
        hash_code = f"#{uuid.uuid4().hex[:6].upper()}"

        # Dynamic quotation calculation based on requested amount or client scope
        if requested_amount and requested_amount > 0:
            total_amount = float(requested_amount)
        elif "college" in client.lower():
            total_amount = 15000.0
        else:
            total_amount = 29500.0

        # Itemized cost breakdown scaled to total_amount
        breakdown = [
            {"category": "DevOps", "amount": round(total_amount * 0.44, 2), "percentage": 44},
            {"category": "Infra Cloud", "amount": round(total_amount * 0.26, 2), "percentage": 26},
            {"category": "Support SLA", "amount": round(total_amount * 0.17, 2), "percentage": 17},
            {"category": "Buffer", "amount": round(total_amount * 0.13, 2), "percentage": 13},
        ]

        quote = Quotation(
            id=quote_id,
            inquiry_id=inquiry_id,
            version="v2.1-draft",
            hash_code=hash_code,
            total_amount=total_amount,
            schedule_tier="3-Tier Growth",
            feasibility_score=94.2,
            projected_margin="38.5%",
            risk_score="Low (0.12)"
        )
        quote.breakdown = breakdown
        db.add(quote)

        # Generate proposal & email draft
        proposal_id = f"PRP-{uuid.uuid4().hex[:6].upper()}"
        prop = Proposal(
            id=proposal_id,
            quotation_id=quote_id,
            recipient_email=f"procurement@{client.lower().replace(' ', '')}.com",
            subject=f"SmallBiz AI x {client}: Automated Quotation Proposal ({hash_code})",
            preview_body=f"Hi team, our multi-agent ops room has validated your architecture requirements and generated proposal {hash_code} for {total_amount}."
        )
        prop.sections = [
            {"title": "Executive Summary", "words": 380, "status": "ready"},
            {"title": "Technical Architecture & Operational Workflow", "words": 520, "status": "ready"},
            {"title": "Pricing & Milestone Breakdown", "words": 290, "status": "ready"},
            {"title": "Service Level Agreement (99.9%)", "words": 230, "status": "ready"}
        ]
        db.add(prop)

        # Update Sales Agent state in SQLite
        sales_agent = db.query(AgentState).filter(AgentState.id == "sales").first()
        if sales_agent:
            sales_agent.progress = 85
            sales_agent.current_activity = f"QUOTATION {hash_code} GENERATED"
            sales_agent.status = "composing"
            sales_agent.status_label = "Ready"
            details = sales_agent.details
            details["quotationVersion"] = "v2.1-draft"
            details["quotationHash"] = hash_code
            details["quotationTotal"] = total_amount
            sales_agent.details = details

        now_str = datetime.utcnow().strftime("%H:%M:%S.%f")[:11]
        log = ExecutionLog(
            id=f"log-{uuid.uuid4().hex[:8]}",
            timestamp_str=now_str,
            agent_id="sales",
            agent_name="SALES & WRITING AGENT",
            level="success",
            message=f"Quotation #{quote_id} generated for {client} ({total_amount} total, {hash_code})."
        )
        db.add(log)

        # Handoff to Operations Agent
        switch_service.handoff(
            from_agent="sales_writing_agent",
            to_agent="operations_agent",
            payload={"quotationId": quote_id, "amount": total_amount, "hash": hash_code}
        )

        db.commit()
        db.refresh(quote)
        return quote


quotation_service = QuotationService()

