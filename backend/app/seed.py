"""Seed the database with an initial admin user and sample data.
Run inside the backend container: python -m app.seed
"""
from app.db.database import SessionLocal, Base, engine
from app.core.security import hash_password
from app.models.user import User, UserRole
from app.models.school_class import SchoolClass

Base.metadata.create_all(bind=engine)


def run():
    db = SessionLocal()
    try:
        if not db.query(User).filter(User.email == "admin@school.com").first():
            admin = User(
                name="Admin",
                email="admin@school.com",
                hashed_password=hash_password("Admin@123"),
                role=UserRole.admin,
            )
            db.add(admin)
            print("Created default admin user: admin@school.com / Admin@123")

        if db.query(SchoolClass).count() == 0:
            for grade in ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5"]:
                for section in ["A", "B"]:
                    db.add(SchoolClass(name=grade, section=section))
            print("Seeded sample classes")

        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    run()
