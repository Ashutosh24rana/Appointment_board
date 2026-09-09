# Appointment Board

A full-stack shared appointment board for a team. Users can view, add,
edit, complete, and cancel appointments, filter them by date and status, and
rely on automatic double-booking prevention — no login required, one board for
everyone.

## About this product

- **What it does:** keeps the team's schedule on a single board. Each
  appointment has a title, optional description, date, start/end time, and a
  status (`scheduled`, `completed`, `cancelled`).
- **Double-booking prevention:** two `scheduled` appointments on the same date
  may never overlap.
  Conflicts are rejected with HTTP `409` and shown inline in the form.
- **Past dates blocked:** appointments can only be scheduled for today or
  future dates.
- **Cancelled slots free up:** cancelled (and completed) appointments don't
  block their time slot for new bookings.
- **Terminal states are locked:** completed/cancelled appointments can't be
  edited, completed, or cancelled again — the API returns a clear `400` error
  and the UI disables those buttons.

## Tech stack

| Layer    | Technology                                                       |
|----------|------------------------------------------------------------------|
| Frontend | React (Vite), Tailwind CSS, `fetch` API calls                    |
| Backend  | FastAPI, SQLAlchemy ORM, Pydantic validation, Alembic migrations |
| Database | MySQL                                                            |

## Folder structure

```
Appointment_board/
├── .env                        # THE single env file (backend + frontend)
├── README.md                   # this file
│
├── backend/                    # FastAPI project
│   ├── app/
│   │   ├── main.py             # app entrypoint, CORS, router includes
│   │   ├── config.py           # settings, loads the root .env (DATABASE_URL required)
│   │   ├── database.py         # engine, SessionLocal, Base, get_db
│   │   ├── models/             # SQLAlchemy models
│   │   ├── schemas/            # Pydantic request/response schemas
│   │   ├── crud/               # DB operations + overlap checks
│   │   ├── routers/            # HTTP routes
│   │   └── utils/              # pure business-rule helpers
│   ├── alembic/                # migrations (env.py + versions/)
│   ├── alembic.ini
│   ├── seed.py                 # inserts 5 sample appointments
│   ├── requirements.txt
│   ├── .env.example            # template only
│   └── README.md
│
└── frontend/                   # React (Vite) project
    ├── index.html
    ├── package.json
    ├── vite.config.js          # reads the root .env via envDir: '../'
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── public/
    ├── src/
    │   ├── main.jsx            # React entrypoint
    │   ├── App.jsx             # header + layout shell
    │   ├── api/                # backend HTTP calls
    │   ├── components/         # Board, Card, FilterBar, FormModal, Toast
    │   ├── hooks/              # useAppointments (data + actions + toast)
    │   ├── styles/             # Tailwind + animations
    │   └── utils/              # client-side form validation
    └── README.md
```

## Backend folder structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app, CORS, validation-error handler,
│   │                           # /health, includes the appointments router
│   ├── config.py               # Settings (pydantic BaseSettings),
│   │                           # DATABASE_URL is required, mysql:// auto-converted
│   ├── database.py             # SQLAlchemy engine, SessionLocal, Base, get_db
│   ├── models/
│   │   ├── __init__.py
│   │   └── appointment.py      # Appointment table: id, title, description,
│   │                           # date, start/end_time, status enum,
│   │                           # created_at / updated_at
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── appointment.py      # AppointmentCreate / AppointmentUpdate
│   │                           # (required fields, end > start, no past dates)
│   │                           # + AppointmentResponse
│   ├── crud/
│   │   ├── __init__.py
│   │   └── appointment.py      # list, get-or-404, create, update, complete,
│   │                           # cancel, same-date overlap check
│   ├── routers/
│   │   ├── __init__.py
│   │   └── appointments.py     # GET/POST /appointments, PUT /appointments/{id},
│   │                           # PATCH /appointments/{id}/complete|/cancel
│   └── utils/
│       ├── __init__.py
│       └── validators.py       # times_overlap() + ensure_end_after_start()
├── alembic/
│   ├── env.py                  # reads URL from app.config, loads model metadata
│   └── versions/
│       └── 0001_create_appointments.py
├── alembic.ini
├── seed.py                     # 5 sample rows across dates/statuses (skips if data exists)
├── requirements.txt
├── .env.example
└── README.md
```

### API endpoints

| Method | Path                              | Purpose                          |
|--------|-----------------------------------|----------------------------------|
| GET    | `/appointments?date=&status=`     | List, optionally filtered        |
| POST   | `/appointments`                   | Create (201)                     |
| PUT    | `/appointments/{id}`              | Edit a scheduled appointment     |
| PATCH  | `/appointments/{id}/complete`     | Mark as completed                |
| PATCH  | `/appointments/{id}/cancel`       | Cancel                           |


## Frontend folder structure

```
frontend/
├── index.html
├── package.json                # react, react-dom, vite, tailwindcss
├── vite.config.js              # React plugin, dev server :5173, envDir: '../'
├── tailwind.config.js          # content: index.html + src/**/*.{js,jsx}
├── postcss.config.js
├── .env.example
├── public/
└── src/
    ├── main.jsx                # mounts <App />, imports global CSS
    ├── App.jsx                 # sticky header + <AppointmentBoard /> shell
    ├── api/
    │   └── appointments.js     # list/create/update/complete/cancel via fetch
    ├── components/
    │   ├── AppointmentBoard.jsx      # container: list, filters, modal + toast state,
    │   │                             # status counts, skeleton + empty states
    │   ├── FilterBar.jsx             # date picker + status dropdown
    │   ├── AppointmentCard.jsx       # display + Edit/Complete/Cancel buttons,
    │   │                             # status badge, cancelled styling
    │   ├── AppointmentFormModal.jsx  # shared Add/Edit form, client validation,
    │   │                             # server errors shown inline
    │   └── Toast.jsx                 # success/error banner (auto-dismiss)
    ├── hooks/
    │   └── useAppointments.js  # fetch/add/edit/complete/cancel + filters + toast
    ├── styles/
    │   └── index.css           # Tailwind, animations, skeleton shimmer
    └── utils/
        └── validation.js       # required fields, end > start, no past dates,
                                # no already-passed slots today + todayLocal()
```

### UI flow

1. `AppointmentBoard` loads and shows all appointments with status counts.
2. `FilterBar` filters by date and/or status (server-side query params).
3. "Add Appointment" opens the modal in create mode; Edit reopens it pre-filled.
4. The form validates locally first; server errors (e.g. `409` conflict) appear
   inside the modal, and every action shows a toast.
5. Cancelled appointments stay visible, dimmed with strikethrough + badge.

## Setup instructions

### Prerequisites

- Python 3.12+, a running MySQL server.

### 1. Database (once)

```sql
CREATE DATABASE appointment_board;
```

### 2. Environment — one `.env` at the project root



```ini
DATABASE_URL="mysql://root:yourpassword@localhost:3306/appointment_board"
FRONTEND_URL="http://localhost:5173"
VITE_API_URL="http://localhost:8000"
```

| Variable       | Used by | Purpose                                              |
|----------------|---------|------------------------------------------------------|
| `DATABASE_URL` | backend | MySQL URL (plain `mysql://` is auto-converted for SQLAlchemy; **required**, no hardcoded fallback) |
| `FRONTEND_URL` | backend | CORS origin                                          |
| `VITE_API_URL` | frontend| Backend base URL (Vite reads the root `.env` via `envDir`) |

`backend/.env.example` and `frontend/.env.example` are templates only.

### 3. Backend — http://localhost:8000

```powershell
cd backend
python -m venv .venv; .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
alembic upgrade head
python seed.py
uvicorn app.main:app --reload --port 8000
```

Health check: `GET /health` → `{"status":"ok"}`.

### 4. Frontend — http://localhost:5173

```powershell
cd frontend
npm install
npm run dev
```
