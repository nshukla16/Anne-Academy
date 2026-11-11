from datetime import date as date_type

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.deps import get_current_user
from app.models.attendance import Attendance
from app.models.user import User
from app.schemas.attendance import BulkAttendanceMark, AttendanceOut

router = APIRouter(prefix="/attendance", tags=["attendance"])


@router.get("", response_model=list[AttendanceOut])
def get_attendance(
    date: date_type | None = Query(default=None),
    class_id: int | None = Query(default=None),
    student_id: int | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    from app.models.student import Student

    query = db.query(Attendance)
    if date:
        query = query.filter(Attendance.date == date)
    if student_id:
        query = query.filter(Attendance.student_id == student_id)
    if class_id:
        query = query.join(Student).filter(Student.class_id == class_id)
    return query.all()


@router.post("/bulk", response_model=list[AttendanceOut])
def mark_bulk_attendance(payload: BulkAttendanceMark, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    results = []
    for record in payload.records:
        existing = (
            db.query(Attendance)
            .filter(Attendance.student_id == record.student_id, Attendance.date == record.date)
            .first()
        )
        if existing:
            existing.status = record.status
            results.append(existing)
        else:
            new_record = Attendance(student_id=record.student_id, date=record.date, status=record.status)
            db.add(new_record)
            results.append(new_record)
    db.commit()
    for r in results:
        db.refresh(r)
    return results
