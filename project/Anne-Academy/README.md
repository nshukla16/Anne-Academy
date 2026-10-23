# Brightleaf School CRM

A full-stack School CRM: manage admissions enquiries (leads), students, teachers,
classes, attendance, and fees.

**Stack**
- Backend: FastAPI, SQLAlchemy 2.0, MySQL 8, JWT auth (python-jose + passlib)
- Frontend: React 18 + TypeScript + Vite + Tailwind CSS
- Database: MySQL 8.4
- Orchestration: Docker Compose (+ Adminer for DB inspection)

## Project structure

```
school-crm/
├── backend/            FastAPI app
│   └── app/
│       ├── core/       settings, JWT/password hashing
│       ├── db/         SQLAlchemy engine/session
│       ├── models/     ORM models
│       ├── schemas/    Pydantic request/response models
│       ├── routers/    API endpoints
│       ├── deps.py     auth dependencies
│       ├── main.py     app entrypoint
│       └── seed.py     creates default admin + sample classes
├── frontend/           React + TS + Tailwind app
│   └── src/
│       ├── api/        axios client
│       ├── context/    auth context
│       ├── components/ shared UI (layout, modal, badges, stat cards)
│       ├── pages/      Login, Dashboard, Leads, Students, Teachers, Classes, Attendance, Fees
│       └── types/      shared TypeScript types
└── docker-compose.yml
```

## Quick start (Docker)

1. Copy the environment file and adjust secrets:
   ```bash
   cp .env.example .env
   ```
2. Build and start everything:
   ```bash
   docker compose up --build
   ```
3. Services:
   - Frontend: http://localhost:5173
   - Backend API docs (Swagger): http://localhost:8000/docs
   - Adminer (DB UI): http://localhost:8080 (server: `mysql`, user/password from `.env`)

4. The backend seeds a default admin on first boot:
   - **Email:** `admin@school.com`
   - **Password:** `Admin@123` 

   Change this password immediately in a real deployment (there's no self-service
   "change password" endpoint yet — update it directly via `/api/v1/auth/register`
   as an admin, or extend the API).

## Running without Docker

**Backend**
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # point DB_HOST at your local MySQL
python -m app.seed
uvicorn app.main:app --reload
```

**Frontend**
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Core CRM concepts

- **Leads** (`/leads`) represent admissions enquiries moving through
  `new → contacted → follow_up → admitted / lost`, each with a follow-up note log.
- **Students** (`/students`) are enrolled students; creating one can optionally link
  back to the originating lead, which auto-marks that lead as `admitted`.
- **Teachers**, **Classes**, **Attendance**, and **Fees** round out day-to-day school
  operations, each with its own CRUD API and matching UI page.
- **Dashboard** (`/dashboard/stats`) aggregates headline numbers across all of the above.

## Notes for production hardening

This is a solid starting scaffold, not a production-hardened system. Before going live, you'd want to:
- Replace `Base.metadata.create_all` with proper Alembic migrations (a migrations folder is easy to add on top of the existing SQLAlchemy models).
- Add refresh tokens / shorter-lived access tokens and rate limiting on `/auth/login`.
- Add role-based authorization checks throughout the routers (currently every authenticated user can access every endpoint; `require_admin` exists but is only wired into `/auth/register`).
- Build the frontend for production (`npm run build`) and serve the static bundle via nginx instead of the Vite dev server.
- Add input validation/sanitization for the free-text fields and pagination for list endpoints.
- Add automated tests (pytest for the API, Vitest/React Testing Library for the UI).
