import json
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Text, DateTime
from app.database import Base

class AgentState(Base):
    __tablename__ = "agents"

    id = Column(String, primary_key=True)  # research, analysis, sales, operations
    order = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    role = Column(String, nullable=False)
    status = Column(String, default="active")
    status_label = Column(String, default="Active")
    current_activity = Column(String, nullable=False)
    progress = Column(Integer, default=50)
    token_count = Column(String, default="4.2k tokens/s")
    latency = Column(String, default="42ms")
    icon = Column(String, default="Cpu")
    accent_color = Column(String, default="#6685AF")
    summary = Column(Text, default="")
    tools_json = Column(Text, default="[]")
    metrics_json = Column(Text, default="[]")
    details_json = Column(Text, default="{}")
    recent_messages_json = Column(Text, default="[]")
    history_json = Column(Text, default="[]")
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    @property
    def tools(self):
        try: return json.loads(self.tools_json)
        except: return []

    @tools.setter
    def tools(self, v): self.tools_json = json.dumps(v)

    @property
    def metrics(self):
        try: return json.loads(self.metrics_json)
        except: return []

    @metrics.setter
    def metrics(self, v): self.metrics_json = json.dumps(v)

    @property
    def details(self):
        try: return json.loads(self.details_json)
        except: return {}

    @details.setter
    def details(self, v): self.details_json = json.dumps(v)

    @property
    def recent_messages(self):
        try: return json.loads(self.recent_messages_json)
        except: return []

    @recent_messages.setter
    def recent_messages(self, v): self.recent_messages_json = json.dumps(v)

    @property
    def history(self):
        try: return json.loads(self.history_json)
        except: return []

    @history.setter
    def history(self, v): self.history_json = json.dumps(v)

