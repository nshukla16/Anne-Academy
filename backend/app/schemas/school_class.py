from pydantic import BaseModel, ConfigDict


class SchoolClassBase(BaseModel):
    name: str
    section: str | None = None
    academic_year: str = "2026-2027"


class SchoolClassCreate(SchoolClassBase):
    pass


class SchoolClassOut(SchoolClassBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
