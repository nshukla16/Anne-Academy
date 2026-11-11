from datetime import date

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.deps import get_current_user
from app.models.student import Student
from app.models.teacher import Teacher
from app.models.school_class import SchoolClass
from app.models.lead import Lead, LeadStatus
from app.models.fee import FeePayment, PaymentStatus
from app.models.attendance import Attendance, AttendanceStatus
from app.models.user import User
from app.schemas.dashboard import DashboardStats

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/stats", response_model=DashboardStats)
def get_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    total_students = db.query(func.count(Student.id)).scalar() or 0
    total_teachers = db.query(func.count(Teacher.id)).scalar() or 0
    total_classes = db.query(func.count(SchoolClass.id)).scalar() or 0
    new_leads = db.query(func.count(Lead.id)).filter(Lead.status == LeadStatus.new).scalar() or 0
    admitted_leads = db.query(func.count(Lead.id)).filter(Lead.status == LeadStatus.admitted).scalar() or 0

    pending_fee_amount = (
        db.query(func.coalesce(func.sum(FeePayment.amount), 0))
        .filter(FeePayment.status.in_([PaymentStatus.pending, PaymentStatus.overdue]))
        .scalar()
        or 0
    )
    collected_fee_amount = (
        db.query(func.coalesce(func.sum(FeePayment.amount), 0))
        .filter(FeePayment.status == PaymentStatus.paid)
        .scalar()
        or 0
    )

    today = date.today()
    present_today = (
        db.query(func.count(Attendance.id))
        .filter(Attendance.date == today, Attendance.status == AttendanceStatus.present)
        .scalar()
        or 0
    )
    absent_today = (
        db.query(func.count(Attendance.id))
        .filter(Attendance.date == today, Attendance.status == AttendanceStatus.absent)
        .scalar()
        or 0
    )

    return DashboardStats(
        total_students=total_students,
        total_teachers=total_teachers,
        total_classes=total_classes,
        new_leads=new_leads,
        admitted_leads=admitted_leads,
        pending_fee_amount=float(pending_fee_amount),
        collected_fee_amount=float(collected_fee_amount),
        attendance_today_present=present_today,
        attendance_today_absent=absent_today,
    )
