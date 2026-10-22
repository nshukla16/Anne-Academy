import enum
from sqlalchemy import Column, Integer, String, Text, DateTime, Enum, ForeignKey, func
from sqlalchemy.orm import relationship
from app.db.database import Base


class LeadStatus(str, enum.Enum):
    new = "new"
    contacted = "contacted"
    follow_up = "follow_up"
    admitted = "admitted"
    lost = "lost"


class LeadSource(str, enum.Enum):
    website = "website"
    walk_in = "walk_in"
    referral = "referral"
    phone = "phone"
    social_media = "social_media"
    other = "other"


class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    student_name = Column(String(150), nullable=False)
    parent_name = Column(String(150), nullable=True)
    phone = Column(String(30), nullable=True)
    email = Column(String(150), nullable=True)
    interested_class = Column(String(50), nullable=True)
    source = Column(Enum(LeadSource), default=LeadSource.other)
    status = Column(Enum(LeadStatus), default=LeadStatus.new)
    assigned_to_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    assigned_to = relationship("User")
    notes = relationship("LeadNote", back_populates="lead", cascade="all, delete-orphan")
    converted_student = relationship("Student", back_populates="lead", uselist=False)


class LeadNote(Base):
    __tablename__ = "lead_notes"

    id = Column(Integer, primary_key=True, index=True)
    lead_id = Column(Integer, ForeignKey("leads.id"), nullable=False)
    note = Column(Text, nullable=False)
    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    lead = relationship("Lead", back_populates="notes")
    created_by = relationship("User")
