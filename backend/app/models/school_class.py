from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db.database import Base


class SchoolClass(Base):
    __tablename__ = "school_classes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)      # e.g. "Grade 5"
    section = Column(String(20), nullable=True)     # e.g. "A"
    academic_year = Column(String(20), nullable=False, default="2026-2027")

    students = relationship("Student", back_populates="school_class")
    fee_structures = relationship("FeeStructure", back_populates="school_class")
