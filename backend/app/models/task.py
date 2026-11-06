from datetime import datetime
from sqlalchemy import Column, String, DateTime, Boolean
from app.database import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    assigned_to = Column(String, default="Platform Bot")
    status = Column(String, default="dispatched")  # dispatched, pending, syncing
    is_checklist_item = Column(Boolean, default=False)
    is_checked = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

