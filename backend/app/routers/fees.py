from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.deps import get_current_user
from app.models.fee import FeeStructure, FeePayment
from app.models.user import User
from app.schemas.fee import FeeStructureCreate, FeeStructureOut, FeePaymentCreate, FeePaymentOut

router = APIRouter(prefix="/fees", tags=["fees"])


@router.get("/structures", response_model=list[FeeStructureOut])
def list_fee_structures(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(FeeStructure).all()


@router.post("/structures", response_model=FeeStructureOut)
def create_fee_structure(payload: FeeStructureCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    structure = FeeStructure(**payload.model_dump())
    db.add(structure)
    db.commit()
    db.refresh(structure)
    return structure


@router.get("/payments", response_model=list[FeePaymentOut])
def list_fee_payments(student_id: int | None = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(FeePayment)
    if student_id:
        query = query.filter(FeePayment.student_id == student_id)
    return query.order_by(FeePayment.created_at.desc()).all()


@router.post("/payments", response_model=FeePaymentOut)
def create_fee_payment(payload: FeePaymentCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    payment = FeePayment(**payload.model_dump())
    db.add(payment)
    db.commit()
    db.refresh(payment)
    return payment


@router.put("/payments/{payment_id}", response_model=FeePaymentOut)
def update_fee_payment(payment_id: int, payload: FeePaymentCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    payment = db.query(FeePayment).filter(FeePayment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(payment, field, value)
    db.commit()
    db.refresh(payment)
    return payment
