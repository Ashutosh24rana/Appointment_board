# Appointment Board — Backend (FastAPI + MySQL)

Env: single project-root `.env` (see `../.env`) — no `.env` inside `backend/`.

## Setup
```powershell
cd backend
python -m venv .venv; .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
# edit ../.env if needed (DATABASE_URL, FRONTEND_URL)
# create MySQL database once:
#   CREATE DATABASE appointment_board;
alembic upgrade head
python seed.py
uvicorn app.main:app --reload --port 8000
```

API: http://localhost:8000 — docs: http://localhost:8000/docs — health: `/health`
