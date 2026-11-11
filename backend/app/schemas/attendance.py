from datetime import date
from pydantic import BaseModel, ConfigDict
from app.models.attendance import AttendanceStatus


class AttendanceMark(BaseModel):
    student_id: int
    date: date
    status: AttendanceStatus


class BulkAttendanceMark(BaseModel):
    class_id: int
    date: date
    records: list[AttendanceMark]


class AttendanceOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    student_id: int
    date: date
    status: AttendanceStatus
