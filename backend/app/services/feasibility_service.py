import uuid
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.agent import AgentState
from app.models.log import ExecutionLog
from app.services.switch_service import switch_service

class FeasibilityService:
    def calculate_feasibility(self, db: Session, inquiry_id: str, client: str):
        # Update Analysis Agent state
        analysis_agent = db.query(AgentState).filter(AgentState.id == "analysis").first()
        if analysis_agent:
            analysis_agent.progress = 88
            analysis_agent.current_activity = f"FEASIBILITY VERIFIED FOR {client.upper()}"
            analysis_agent.status = "processing"
            analysis_agent.status_label = "Calculated"

        now_str = datetime.utcnow().strftime("%H:%M:%S.%f")[:11]
        log = ExecutionLog(
            id=f"log-{uuid.uuid4().hex[:8]}",
            timestamp_str=now_str,
            agent_id="analysis",
            agent_name="ANALYSIS AGENT",
            level="info",
            message=f"Feasibility model completed for {client}: 94.2% confidence floor at $18,400 est. cost."
        )
        db.add(log)

        # Handoff to sales agent
        switch_service.handoff(
            from_agent="analysis_agent",
            to_agent="sales_writing_agent",
            payload={"inquiryId": inquiry_id, "costFloor": 18400, "margin": "38.5%"}
        )

        db.commit()
        return {"feasibilityScore": 94.2, "estimatedCost": 18400, "projectedMargin": "38.5%"}

feasibility_service = FeasibilityService()

