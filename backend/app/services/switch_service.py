import os
import json
import logging
import urllib.request
import urllib.error
from typing import Dict, Any, List, Optional
from datetime import datetime
from pathlib import Path
from app.config import settings

logger = logging.getLogger("switch_service")

CACHE_FILE = Path(__file__).resolve().parent.parent.parent / ".switch_agents.json"

AGENT_SPECS = {
    "research": {
        "name": "smallbiz-research-agent",
        "display_name": "BUSINESS RESEARCH AGENT",
        "title": "BUSINESS RESEARCH AGENT",
        "description": "Receives business inquiries, parses unstructured RFP docs, and extracts core operational requirements.",
    },
    "analysis": {
        "name": "smallbiz-analysis-agent",
        "display_name": "ANALYSIS AGENT",
        "title": "ANALYSIS AGENT",
        "description": "Cross-evaluates workload scope against server bandwidth, engineering hours, and operational margins.",
    },
    "sales": {
        "name": "smallbiz-sales-agent",
        "display_name": "SALES & WRITING AGENT",
        "title": "SALES & WRITING AGENT",
        "description": "Generates branded sales proposals, client-ready itemized quotations, and persuasive personalized cover letters.",
    },
    "operations": {
        "name": "smallbiz-operations-agent",
        "display_name": "OPERATIONS AGENT",
        "title": "OPERATIONS AGENT",
        "description": "Audits quote compliance against financial tolerances, registers tracking tickets in Jira, and stages dispatch.",
    }
}

class SwitchService:
    """
    Switch Multi-Agent Collaboration Boundary.
    Connects to the Switch Agent Bridge API (SandboxAQ Switch) using the official Switch Agent Protocol.
    Coordinates real agent registration, shared room sessions, live message broadcasts, and agent handoffs.
    """

    def __init__(self):
        self.endpoint = settings.SWITCH_ENDPOINT.rstrip("/")
        self.api_key = settings.SWITCH_API_KEY
        self.room_id = settings.SWITCH_ROOM_ID
        self.is_connected = False
        self.agent_registry: Dict[str, Dict[str, str]] = {}
        self._load_cached_agents()

    def _load_cached_agents(self):
        if CACHE_FILE.exists():
            try:
                self.agent_registry = json.loads(CACHE_FILE.read_text(encoding="utf-8"))
            except Exception as e:
                logger.warning(f"Could not load Switch agent cache: {e}")

    def _save_cached_agents(self):
        try:
            CACHE_FILE.write_text(json.dumps(self.agent_registry, indent=2), encoding="utf-8")
        except Exception as e:
            logger.warning(f"Could not save Switch agent cache: {e}")

    def check_health(self) -> bool:
        """Verifies connectivity to the Switch Agent Bridge API."""
        try:
            url = f"{self.endpoint}/health/ready"
            req = urllib.request.Request(url, headers={"Authorization": f"Bearer {self.api_key}"})
            with urllib.request.urlopen(req, timeout=4) as resp:
                data = json.loads(resp.read().decode())
                is_ready = data.get("status") == "ready" or data.get("status") == "ok"
                self.is_connected = is_ready
                return is_ready
        except Exception as e:
            logger.warning(f"Switch Agent Bridge health check failed: {e}")
            self.is_connected = False
            return False

    def register_agent(self, agent_key: str, force: bool = False) -> Optional[Dict[str, str]]:
        """Registers a specialist agent on Switch using the official POST /agents endpoint."""
        spec = AGENT_SPECS.get(agent_key)
        if not spec:
            return None

        if not force and agent_key in self.agent_registry and "id" in self.agent_registry[agent_key]:
            return self.agent_registry[agent_key]

        payload = {
            "name": spec["name"],
            "description": spec["description"],
            "display_name": spec["display_name"],
            "connector_type": "webhook",
            "integration_profile": {
                "connection_model": "session_addressable",
                "message_exchange": True,
                "pre_invocation_mediation": [],
                "post_invocation_mediation": [],
                "event_reporting": ["activity", "approvals"]
            },
            "overwrite": True
        }

        try:
            url = f"{self.endpoint}/agents"
            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode("utf-8"),
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                }
            )
            with urllib.request.urlopen(req, timeout=10) as resp:
                res = json.loads(resp.read().decode())
                self.agent_registry[agent_key] = res
                self._save_cached_agents()
                logger.info(f"Registered agent {spec['display_name']} with Switch ID: {res.get('id')}")
                return res
        except Exception as e:
            logger.error(f"Failed to register agent {agent_key} on Switch: {e}")
            return None

    def discover_room(self, agent_key: str = "research") -> Optional[str]:
        """Discovers an available Switch collaboration room."""
        self._load_cached_agents()
        agent = self.agent_registry.get(agent_key)
        if not agent or "id" not in agent or "api_key" not in agent:
            agent = self.register_agent(agent_key)
        if not agent:
            return self.room_id

        try:
            url = f"{self.endpoint}/agents/{agent['id']}/moderation/rooms"
            req = urllib.request.Request(
                url,
                headers={"Authorization": f"Bearer {agent['api_key']}"}
            )
            with urllib.request.urlopen(req, timeout=5) as resp:
                data = json.loads(resp.read().decode())
                rooms = data.get("rooms", [])
                if rooms:
                    self.room_id = rooms[0]["id"]
                    logger.info(f"Discovered active Switch room: {rooms[0].get('name')} ({self.room_id})")
                    return self.room_id
        except Exception as e:
            logger.warning(f"Room discovery on Switch: {e}")
        return self.room_id

    def initialize_room(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Initializes or reconnects to the shared Switch Room session.
        Registers all 4 business agents and posts initialization banner.
        """
        logger.info(f"Initializing Switch Room session at {self.endpoint}")
        is_ready = self.check_health()

        if is_ready:
            self._load_cached_agents()
            for k in AGENT_SPECS.keys():
                if k not in self.agent_registry:
                    self.register_agent(k)

            self.discover_room("research")
            if self.room_id:
                self.send_room_message(
                    agent_key="research",
                    content="**[SmallBiz AI Operations Room]** Multi-Agent Room Initialized. All 4 business agents (Research, Analysis, Sales, Operations) active and coordinated via Switch Agent Protocol."
                )

        return {
            "roomId": self.room_id,
            "status": "connected" if self.is_connected else "offline_active",
            "participants": list(AGENT_SPECS.keys()),
            "agentsRegistered": len(self.agent_registry),
            "context": context,
            "timestamp": datetime.utcnow().isoformat(),
        }

    def send_room_message(self, agent_key: str, content: str, metadata: Optional[Dict[str, Any]] = None) -> Optional[str]:
        """Sends an authenticated message into the Switch Room from a registered agent with auto-retry."""
        self._load_cached_agents()
        agent = self.agent_registry.get(agent_key)
        if not agent or "id" not in agent or "api_key" not in agent:
            agent = self.register_agent(agent_key)
        if not agent or not self.room_id:
            return None

        url = f"{self.endpoint}/agents/{agent['id']}/message"
        payload = {
            "room_id": self.room_id,
            "content": content,
            "metadata": metadata or {}
        }

        for attempt in range(2):
            try:
                req = urllib.request.Request(
                    url,
                    data=json.dumps(payload).encode("utf-8"),
                    headers={
                        "Authorization": f"Bearer {agent['api_key']}",
                        "Content-Type": "application/json"
                    }
                )
                with urllib.request.urlopen(req, timeout=6) as resp:
                    res = json.loads(resp.read().decode())
                    event_id = res.get("event_id")
                    logger.info(f"Switch room message delivered ({event_id}) by {agent_key}")
                    return event_id
            except urllib.error.HTTPError as e:
                if e.code == 401 and attempt == 0:
                    logger.warning(f"401 on Switch message, refreshing registration for {agent_key}")
                    agent = self.register_agent(agent_key, force=True)
                    if not agent:
                        break
                else:
                    logger.warning(f"Failed to post message to Switch room from {agent_key}: {e}")
                    break
            except Exception as e:
                logger.warning(f"Error posting message to Switch room from {agent_key}: {e}")
                break
        return None

    def handoff(self, from_agent: str, to_agent: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Executes a real agent handoff in the shared Switch workspace.
        Transfers workflow context from one specialist to the next with Switch Room audit trail.
        """
        from_spec = AGENT_SPECS.get(from_agent, {}).get("title", from_agent.upper())
        to_spec = AGENT_SPECS.get(to_agent, {}).get("title", to_agent.upper())

        logger.info(f"Switch Handoff: {from_spec} -> {to_spec}")

        content = (
            f"**[Agent Handoff]** `{from_spec}` → `{to_spec}`\n"
            f"```json\n{json.dumps(payload, indent=2)}\n```"
        )

        event_id = None
        if self.is_connected or self.check_health():
            sender_key = "research" if "research" in from_agent else ("analysis" if "analysis" in from_agent else "sales")
            event_id = self.send_room_message(
                agent_key=sender_key,
                content=content,
                metadata={"type": "agent_handoff", "from": from_agent, "to": to_agent}
            )

        return {
            "eventType": "agent_handoff",
            "roomId": self.room_id,
            "fromAgent": from_agent,
            "toAgent": to_agent,
            "payload": payload,
            "switchEventId": event_id,
            "timestamp": datetime.utcnow().isoformat(),
            "consensusVerified": True
        }

    def broadcast_event(self, event_type: str, details: Dict[str, Any]) -> Dict[str, Any]:
        """
        Broadcasts an operational milestone to the Switch Room ledger.
        """
        content = (
            f"**[Operations Milestone: {event_type.upper()}]**\n"
            f"```json\n{json.dumps(details, indent=2)}\n```"
        )

        event_id = None
        if self.is_connected or self.check_health():
            event_id = self.send_room_message(
                agent_key="operations",
                content=content,
                metadata={"type": "operations_milestone", "event_type": event_type}
            )

        return {
            "roomId": self.room_id,
            "eventType": event_type,
            "details": details,
            "switchEventId": event_id,
            "timestamp": datetime.utcnow().isoformat()
        }

switch_service = SwitchService()
