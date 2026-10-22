from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.deps import get_current_user
from app.models.school_class import SchoolClass
from app.models.user import User
from app.schemas.school_class import SchoolClassCreate, SchoolClassOut

router = APIRouter(prefix="/classes", tags=["classes"])


@router.get("", response_model=list[SchoolClassOut])
def list_classes(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(SchoolClass).order_by(SchoolClass.name).all()


@router.post("", response_model=SchoolClassOut)
def create_class(payload: SchoolClassCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    school_class = SchoolClass(**payload.model_dump())
    db.add(school_class)
    db.commit()
    db.refresh(school_class)
    return school_class


@router.delete("/{class_id}", status_code=204)
def delete_class(class_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    school_class = db.query(SchoolClass).filter(SchoolClass.id == class_id).first()
    if not school_class:
        raise HTTPException(status_code=404, detail="Class not found")
    db.delete(school_class)
    db.commit()
