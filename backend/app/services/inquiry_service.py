import uuid
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.inquiry import Inquiry
from app.models.agent import AgentState
from app.models.log import ExecutionLog
from app.schemas.inquiry import InquiryCreate
from app.services.switch_service import switch_service

class InquiryService:
    def process_inquiry(self, db: Session, data: InquiryCreate) -> Inquiry:
        inquiry_id = f"INQ-{uuid.uuid4().hex[:6].upper()}"

        inquiry = Inquiry(
            id=inquiry_id,
            client=data.client,
            source_type=data.sourceType,
            status="processed",
            budget_range=data.budgetRange,
            timeline=data.timeline,
        )
        inquiry.key_items = data.keyItems
        db.add(inquiry)

        # Update Business Research Agent state in SQLite
        research_agent = db.query(AgentState).filter(AgentState.id == "research").first()
        if research_agent:
            research_agent.progress = 96
            research_agent.current_activity = f"INGESTED {data.client.upper()} RFP"
            research_agent.status = "active"
            research_agent.status_label = "Active"
            details = research_agent.details
            details["customerRequirements"] = {
                "client": data.client,
                "tier": "Enterprise Growth Tier",
                "budgetRange": data.budgetRange,
                "timeline": data.timeline,
                "keyItems": data.keyItems
            }
            if "recordsProcessed" in details:
                details["recordsProcessed"]["processed"] = min(
                    details["recordsProcessed"].get("total", 16),
                    details["recordsProcessed"].get("processed", 14) + 1
                )
            research_agent.details = details

        # Create execution log
        now_str = datetime.utcnow().strftime("%H:%M:%S.%f")[:11]
        log_entry = ExecutionLog(
            id=f"log-{uuid.uuid4().hex[:8]}",
            timestamp_str=now_str,
            agent_id="research",
            agent_name="BUSINESS RESEARCH AGENT",
            level="success",
            message=f"Inquiry #{inquiry_id} verified & stored for client: {data.client}."
        )
        db.add(log_entry)

        # Notify Switch room of agent handoff to Analysis
        switch_service.handoff(
            from_agent="business_research_agent",
            to_agent="analysis_agent",
            payload={"inquiryId": inquiry_id, "client": data.client, "budget": data.budgetRange}
        )

        db.commit()
        db.refresh(inquiry)
        return inquiry

inquiry_service = InquiryService()

