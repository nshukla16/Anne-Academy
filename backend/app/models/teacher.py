from sqlalchemy import Column, Integer, String, Date, DateTime, func
from app.db.database import Base


class Teacher(Base):
    __tablename__ = "teachers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=True)
    phone = Column(String(30), nullable=True)
    subject = Column(String(100), nullable=True)
    qualification = Column(String(150), nullable=True)
    joining_date = Column(Date, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
