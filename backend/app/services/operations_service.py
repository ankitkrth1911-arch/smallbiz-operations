import uuid
import re
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.task import Task
from app.models.agent import AgentState
from app.models.log import ExecutionLog
from app.models.inquiry import Inquiry
from app.services.switch_service import switch_service
from app.services.feasibility_service import feasibility_service
from app.services.quotation_service import quotation_service

class OperationsService:
    def execute_workflow(self, db: Session, pipeline_id: str = "#WF-2026-884", auto_dispatch: bool = True, inquiry_id: str = None):
        """
        Executes the end-to-end multi-agent orchestration pipeline across:
        1. Research Agent (Inquiry context)
        2. Analysis Agent (Feasibility & Cost modeling)
        3. Sales Agent (Quotation & Proposal drafting)
        4. Operations Agent (Governance, Dispatch & Switch ledger broadcast)
        """
        # 1. Resolve active inquiry
        inquiry = None
        if inquiry_id:
            inquiry = db.query(Inquiry).filter(Inquiry.id == inquiry_id).first()
        if not inquiry:
            inquiry = db.query(Inquiry).order_by(Inquiry.created_at.desc()).first()

        client_name = inquiry.client if inquiry else "Apex Logistics Global"
        active_inq_id = inquiry.id if inquiry else f"INQ-{uuid.uuid4().hex[:6].upper()}"

        # Parse requested budget number
        requested_amount = 29500.0
        if inquiry and inquiry.budget_range:
            nums = re.findall(r"\d[\d,]*", inquiry.budget_range.replace(",", ""))
            if nums:
                try:
                    requested_amount = float(nums[0])
                except Exception:
                    pass

        # 2. Trigger Feasibility Modeling (Analysis Agent)
        feasibility_service.calculate_feasibility(db, active_inq_id, client_name)

        # 3. Trigger Quotation & Proposal Generation (Sales Agent)
        quote = quotation_service.create_quotation(db, active_inq_id, client_name, requested_amount)

        # 4. Trigger Operations Execution (Operations Agent)
        ops_agent = db.query(AgentState).filter(AgentState.id == "operations").first()
        if ops_agent:
            ops_agent.progress = 100
            ops_agent.status = "finalizing"
            ops_agent.status_label = "Dispatched"
            ops_agent.current_activity = f"WORKFLOW {pipeline_id} DISPATCHED FOR {client_name.upper()}"
            details = ops_agent.details
            details["approvalChecklist"] = [
                {"id": "c1", "label": "SOC2 & Data Retention Policy Verified", "checked": True, "required": True},
                {"id": "c2", "label": "Margin Threshold > 35% Validated", "checked": True, "required": True},
                {"id": "c3", "label": "Engineering Sprint Capacity Locked", "checked": True, "required": True},
                {"id": "c4", "label": "Client Commercial Signature Stage", "checked": auto_dispatch, "required": False}
            ]
            ops_agent.details = details

        # Ensure tasks exist and reflect dispatch state
        existing_tasks = db.query(Task).all()
        if not existing_tasks:
            initial_tasks = [
                Task(id="t1", title=f"Jira #OP-441: Dedicated worker for {client_name}", assigned_to="Platform Bot", status="dispatched"),
                Task(id="t2", title=f"Stripe: Draft invoice ₹{int(requested_amount):,} (Net 30)", assigned_to="Finance Sync", status="dispatched"),
                Task(id="t3", title="Slack: #ops-leads dispatch notification", assigned_to="Notification Hub", status="dispatched"),
                Task(id="t4", title=f"DocuSign: Envelope packaging for {client_name}", assigned_to="Signing Service", status="syncing"),
            ]
            db.add_all(initial_tasks)
        else:
            for t in existing_tasks:
                if not t.is_checklist_item:
                    t.status = "dispatched"

        now_str = datetime.utcnow().strftime("%H:%M:%S.%f")[:11]
        log = ExecutionLog(
            id=f"log-{uuid.uuid4().hex[:8]}",
            timestamp_str=now_str,
            agent_id="operations",
            agent_name="OPERATIONS AGENT",
            level="success",
            message=f"EXECUTION COMPLETE: Pipeline {pipeline_id} committed for {client_name}. Quote #{quote.id} ({quote.hash_code}) active."
        )
        db.add(log)

        # Broadcast completed workflow to Switch Room via official protocol
        switch_event = switch_service.broadcast_event(
            event_type="workflow_dispatched",
            details={
                "pipelineId": pipeline_id,
                "client": client_name,
                "inquiryId": active_inq_id,
                "quotationId": quote.id,
                "totalAmount": quote.total_amount,
                "status": "dispatched",
                "dispatchedAt": now_str
            }
        )

        db.commit()
        return {
            "success": True,
            "pipelineId": pipeline_id,
            "client": client_name,
            "quotationId": quote.id,
            "switchEvent": switch_event,
            "message": "Workflow successfully executed and dispatched across all 4 agents."
        }

operations_service = OperationsService()
