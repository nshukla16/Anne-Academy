import random
import string

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.deps import get_current_user
from app.models.student import Student
from app.models.lead import Lead, LeadStatus
from app.models.user import User
from app.schemas.student import StudentCreate, StudentUpdate, StudentOut

router = APIRouter(prefix="/students", tags=["students"])


def generate_admission_no(db: Session) -> str:
    while True:
        candidate = "ADM" + "".join(random.choices(string.digits, k=6))
        if not db.query(Student).filter(Student.admission_no == candidate).first():
            return candidate


@router.get("", response_model=list[StudentOut])
def list_students(
    class_id: int | None = None,
    search: str | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Student)
    if class_id:
        query = query.filter(Student.class_id == class_id)
    if search:
        like = f"%{search}%"
        query = query.filter(Student.name.ilike(like) | Student.admission_no.ilike(like))
    return query.order_by(Student.created_at.desc()).all()


@router.post("", response_model=StudentOut)
def create_student(payload: StudentCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    data = payload.model_dump()
    if not data.get("admission_no"):
        data["admission_no"] = generate_admission_no(db)
    student = Student(**data)
    db.add(student)

    if payload.lead_id:
        lead = db.query(Lead).filter(Lead.id == payload.lead_id).first()
        if lead:
            lead.status = LeadStatus.admitted

    db.commit()
    db.refresh(student)
    return student


@router.get("/{student_id}", response_model=StudentOut)
def get_student(student_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student


@router.put("/{student_id}", response_model=StudentOut)
def update_student(student_id: int, payload: StudentUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(student, field, value)
    db.commit()
    db.refresh(student)
    return student


@router.delete("/{student_id}", status_code=204)
def delete_student(student_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    db.delete(student)
    db.commit()
