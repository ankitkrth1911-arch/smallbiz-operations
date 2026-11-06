import json
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, Float, Integer
from app.database import Base

class Inquiry(Base):
    __tablename__ = "inquiries"

    id = Column(String, primary_key=True, index=True)
    client = Column(String, nullable=False, index=True)
    source_type = Column(String, default="PDF / Webhook")
    status = Column(String, default="processed")
    budget_range = Column(String, default="$25,000 - $35,000")
    timeline = Column(String, default="6 Weeks Turnaround")
    key_items_json = Column(Text, default="[]")
    created_at = Column(DateTime, default=datetime.utcnow)

    @property
    def key_items(self):
        try:
            return json.loads(self.key_items_json)
        except:
            return []

    @key_items.setter
    def key_items(self, items):
        self.key_items_json = json.dumps(items)

