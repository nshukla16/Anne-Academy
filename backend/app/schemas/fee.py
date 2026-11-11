from datetime import date, datetime
from decimal import Decimal
from pydantic import BaseModel, ConfigDict
from app.models.fee import PaymentStatus, PaymentMethod


class FeeStructureBase(BaseModel):
    class_id: int
    term: str
    amount: Decimal
    due_date: date | None = None


class FeeStructureCreate(FeeStructureBase):
    pass


class FeeStructureOut(FeeStructureBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


class FeePaymentBase(BaseModel):
    student_id: int
    fee_structure_id: int | None = None
    amount: Decimal
    status: PaymentStatus = PaymentStatus.pending
    method: PaymentMethod | None = None
    payment_date: date | None = None


class FeePaymentCreate(FeePaymentBase):
    pass


class FeePaymentOut(FeePaymentBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime
