import json
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, Float, Integer
from app.database import Base

class Quotation(Base):
    __tablename__ = "quotations"

    id = Column(String, primary_key=True, index=True)
    inquiry_id = Column(String, index=True, nullable=True)
    version = Column(String, default="v2.1-draft")
    hash_code = Column(String, default="#8F9A2B")
    total_amount = Column(Float, default=29500.0)
    schedule_tier = Column(String, default="3-Tier Growth")
    breakdown_json = Column(Text, default="[]")
    feasibility_score = Column(Float, default=94.2)
    projected_margin = Column(String, default="38.5%")
    risk_score = Column(String, default="Low (0.12)")
    created_at = Column(DateTime, default=datetime.utcnow)

    @property
    def breakdown(self):
        try:
            return json.loads(self.breakdown_json)
        except:
            return []

    @breakdown.setter
    def breakdown(self, val):
        self.breakdown_json = json.dumps(val)

