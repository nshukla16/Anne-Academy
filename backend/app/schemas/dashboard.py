from pydantic import BaseModel


class DashboardStats(BaseModel):
    total_students: int
    total_teachers: int
    total_classes: int
    new_leads: int
    admitted_leads: int
    pending_fee_amount: float
    collected_fee_amount: float
    attendance_today_present: int
    attendance_today_absent: int
