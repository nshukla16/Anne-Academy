from datetime import date, datetime
from pydantic import BaseModel, ConfigDict, EmailStr


class TeacherBase(BaseModel):
    name: str
    email: EmailStr | None = None
    phone: str | None = None
    subject: str | None = None
    qualification: str | None = None
    joining_date: date | None = None


class TeacherCreate(TeacherBase):
    pass


class TeacherUpdate(TeacherBase):
    name: str | None = None


class TeacherOut(TeacherBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime
