from sqlalchemy.orm import Session
from ..models.project import Module, Task, Project

def mark_completed(db: Session, task_id: int = None, module_id: int = None):
    if task_id:
        task = db.query(Task).filter(Task.id == task_id).first()
        if not task:
            return

        task.completed = True
        db.add(task)

        module = task.module

        total_tasks = db.query(Task).filter(Task.module_id == module.id).count()
        completed_tasks = db.query(Task).filter(Task.module_id == module.id, Task.completed == True).count()

        if total_tasks == completed_tasks:
            module.completed = True
            db.add(module)

            project = module.project
            total_modules = db.query(Module).filter(Module.project_id == project.id).count()
            completed_modules = db.query(Module).filter(Module.project_id == project.id, Module.completed == True).count()

            if total_modules == completed_modules:
                project.completed = True
                db.add(project)

        db.commit()
        return True

    elif module_id:
        module = db.query(Module).filter(Module.id == module_id).first()
        if not module:
            return False

        module.completed = True
        db.add(module)

        project = module.project
        total_modules = db.query(Module).filter(Module.project_id == project.id).count()
        completed_modules = db.query(Module).filter(
            Module.project_id == project.id,
            Module.completed == True
        ).count()

        if total_modules == completed_modules:
            project.completed = True
            db.add(project)

        db.commit()
        return True

    return False


