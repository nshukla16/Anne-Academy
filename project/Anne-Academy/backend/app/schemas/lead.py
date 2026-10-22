from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr
from app.models.lead import LeadStatus, LeadSource


class LeadNoteCreate(BaseModel):
    note: str


class LeadNoteOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    note: str
    created_at: datetime


class LeadBase(BaseModel):
    student_name: str
    parent_name: str | None = None
    phone: str | None = None
    email: EmailStr | None = None
    interested_class: str | None = None
    source: LeadSource = LeadSource.other
    status: LeadStatus = LeadStatus.new
    assigned_to_id: int | None = None


class LeadCreate(LeadBase):
    pass


class LeadUpdate(BaseModel):
    student_name: str | None = None
    parent_name: str | None = None
    phone: str | None = None
    email: EmailStr | None = None
    interested_class: str | None = None
    source: LeadSource | None = None
    status: LeadStatus | None = None
    assigned_to_id: int | None = None


class LeadOut(LeadBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime
    updated_at: datetime
    notes: list[LeadNoteOut] = []
