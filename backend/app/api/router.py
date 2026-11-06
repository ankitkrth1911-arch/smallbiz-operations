from fastapi import APIRouter
from app.api.endpoints import (
    inquiries,
    workflows,
    agents,
    quotations,
    proposals,
    tasks,
    dashboard,
    auth,
)

api_router = APIRouter(prefix="/api")

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
api_router.include_router(inquiries.router, prefix="/inquiries", tags=["Inquiries"])
api_router.include_router(workflows.router, prefix="/workflows", tags=["Workflows"])
api_router.include_router(agents.router, prefix="/agents", tags=["Agents"])
api_router.include_router(quotations.router, prefix="/quotations", tags=["Quotations"])
api_router.include_router(proposals.router, prefix="/proposals", tags=["Proposals"])
api_router.include_router(tasks.router, prefix="/tasks", tags=["Tasks"])


