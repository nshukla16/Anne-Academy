import enum
from sqlalchemy import Column, Integer, String, Date, DateTime, Enum, ForeignKey, func
from sqlalchemy.orm import relationship
from app.db.database import Base


class StudentStatus(str, enum.Enum):
    active = "active"
    inactive = "inactive"
    alumni = "alumni"


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    admission_no = Column(String(30), unique=True, index=True, nullable=False)
    name = Column(String(150), nullable=False)
    dob = Column(Date, nullable=True)
    gender = Column(String(20), nullable=True)
    class_id = Column(Integer, ForeignKey("school_classes.id"), nullable=True)
    parent_name = Column(String(150), nullable=True)
    parent_phone = Column(String(30), nullable=True)
    parent_email = Column(String(150), nullable=True)
    address = Column(String(255), nullable=True)
    admission_date = Column(Date, nullable=True)
    status = Column(Enum(StudentStatus), default=StudentStatus.active)
    lead_id = Column(Integer, ForeignKey("leads.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    school_class = relationship("SchoolClass", back_populates="students")
    attendance_records = relationship("Attendance", back_populates="student", cascade="all, delete-orphan")
    fee_payments = relationship("FeePayment", back_populates="student", cascade="all, delete-orphan")
    lead = relationship("Lead", back_populates="converted_student")
