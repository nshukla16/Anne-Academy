from datetime import date, datetime
from pydantic import BaseModel, ConfigDict
from app.models.student import StudentStatus


class StudentBase(BaseModel):
    name: str
    dob: date | None = None
    gender: str | None = None
    class_id: int | None = None
    parent_name: str | None = None
    parent_phone: str | None = None
    parent_email: str | None = None
    address: str | None = None
    admission_date: date | None = None
    status: StudentStatus = StudentStatus.active


class StudentCreate(StudentBase):
    admission_no: str | None = None
    lead_id: int | None = None


class StudentUpdate(BaseModel):
    name: str | None = None
    dob: date | None = None
    gender: str | None = None
    class_id: int | None = None
    parent_name: str | None = None
    parent_phone: str | None = None
    parent_email: str | None = None
    address: str | None = None
    status: StudentStatus | None = None


class StudentOut(StudentBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    admission_no: str
    created_at: datetime
