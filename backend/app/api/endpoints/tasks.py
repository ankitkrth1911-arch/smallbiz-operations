from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.task import Task
from app.schemas.task import TaskResponse, TaskUpdate

router = APIRouter()

@router.get("", response_model=List[TaskResponse])
def get_tasks(db: Session = Depends(get_db)):
    """
    Retrieves all operational tasks and governance checklist items.
    """
    tasks = db.query(Task).all()
    return [
        TaskResponse(
            id=t.id,
            title=t.title,
            assignedTo=t.assigned_to,
            status=t.status,
            isChecklistItem=t.is_checklist_item,
            isChecked=t.is_checked,
            createdAt=t.created_at.isoformat() if t.created_at else None,
            updatedAt=t.updated_at.isoformat() if t.updated_at else None,
        ) for t in tasks
    ]

@router.patch("/{task_id}", response_model=TaskResponse)
def update_task(task_id: str, update: TaskUpdate, db: Session = Depends(get_db)):
    """
    Updates the status or completion state of a task/governance checklist item.
    """
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if update.status is not None:
        task.status = update.status
    if update.title is not None:
        task.title = update.title
    if update.isChecked is not None:
        task.is_checked = update.isChecked

    db.commit()
    db.refresh(task)

    return TaskResponse(
        id=task.id,
        title=task.title,
        assignedTo=task.assigned_to,
        status=task.status,
        isChecklistItem=task.is_checklist_item,
        isChecked=task.is_checked,
        createdAt=task.created_at.isoformat() if task.created_at else None,
        updatedAt=task.updated_at.isoformat() if task.updated_at else None,
    )

