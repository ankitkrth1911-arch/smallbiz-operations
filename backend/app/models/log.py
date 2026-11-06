from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime
from app.database import Base

class ExecutionLog(Base):
    __tablename__ = "execution_logs"

    id = Column(String, primary_key=True)
    timestamp_str = Column(String, nullable=False)
    agent_id = Column(String, index=True)
    agent_name = Column(String, nullable=False)
    level = Column(String, default="info")  # info, success, warn, debug
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

