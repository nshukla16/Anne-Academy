import enum
from sqlalchemy import Column, Integer, String, Numeric, Date, DateTime, Enum, ForeignKey, func
from sqlalchemy.orm import relationship
from app.db.database import Base


class PaymentStatus(str, enum.Enum):
    paid = "paid"
    pending = "pending"
    overdue = "overdue"


class PaymentMethod(str, enum.Enum):
    cash = "cash"
    card = "card"
    bank_transfer = "bank_transfer"
    online = "online"


class FeeStructure(Base):
    __tablename__ = "fee_structures"

    id = Column(Integer, primary_key=True, index=True)
    class_id = Column(Integer, ForeignKey("school_classes.id"), nullable=False)
    term = Column(String(50), nullable=False)   # e.g. "Term 1"
    amount = Column(Numeric(10, 2), nullable=False)
    due_date = Column(Date, nullable=True)

    school_class = relationship("SchoolClass", back_populates="fee_structures")


class FeePayment(Base):
    __tablename__ = "fee_payments"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    fee_structure_id = Column(Integer, ForeignKey("fee_structures.id"), nullable=True)
    amount = Column(Numeric(10, 2), nullable=False)
    status = Column(Enum(PaymentStatus), default=PaymentStatus.pending)
    method = Column(Enum(PaymentMethod), nullable=True)
    payment_date = Column(Date, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    student = relationship("Student", back_populates="fee_payments")
    fee_structure = relationship("FeeStructure")
