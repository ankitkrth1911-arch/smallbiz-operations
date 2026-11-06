import json
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, Integer
from app.database import Base

class Proposal(Base):
    __tablename__ = "proposals"

    id = Column(String, primary_key=True, index=True)
    quotation_id = Column(String, index=True, nullable=True)
    recipient_email = Column(String, nullable=False)
    subject = Column(String, nullable=False)
    preview_body = Column(Text, nullable=False)
    sections_json = Column(Text, default="[]")
    created_at = Column(DateTime, default=datetime.utcnow)

    @property
    def sections(self):
        try:
            return json.loads(self.sections_json)
        except:
            return []

    @sections.setter
    def sections(self, val):
        self.sections_json = json.dumps(val)

