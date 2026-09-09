"""Seed the DB with 4-5 sample appointments across dates/statuses.

Usage:
    cd backend
    python seed.py
"""

import datetime
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))

from sqlalchemy.orm import Session  # noqa: E402

from app.database import Base, SessionLocal, engine  # noqa: E402
from app.models.appointment import Appointment, AppointmentStatus  # noqa: E402


def main() -> None:
    Base.metadata.create_all(bind=engine)  # safety net if alembic not run yet
    db: Session = SessionLocal()
    try:
        if db.query(Appointment).count() > 0:
            print("appointments table already has data — skipping seed.")
            return

        today = datetime.date.today()
        samples = [
            Appointment(
                title="Team standup",
                description="Daily sync with the team",
                date=today,
                start_time=datetime.time(9, 0),
                end_time=datetime.time(9, 30),
                status=AppointmentStatus.scheduled,
            ),
            Appointment(
                title="Design review",
                description="Review new board mockups",
                date=today,
                start_time=datetime.time(11, 0),
                end_time=datetime.time(12, 0),
                status=AppointmentStatus.scheduled,
            ),
            Appointment(
                title="Client demo",
                description="Demo v1 to the client",
                date=today + datetime.timedelta(days=1),
                start_time=datetime.time(14, 0),
                end_time=datetime.time(15, 0),
                status=AppointmentStatus.scheduled,
            ),
            Appointment(
                title="Sprint retro",
                description="Last sprint retrospective",
                date=today - datetime.timedelta(days=1),
                start_time=datetime.time(16, 0),
                end_time=datetime.time(17, 0),
                status=AppointmentStatus.completed,
            ),
            Appointment(
                title="Vendor call",
                description="Cancelled vendor sync",
                date=today,
                start_time=datetime.time(15, 0),
                end_time=datetime.time(15, 30),
                status=AppointmentStatus.cancelled,
            ),
        ]
        db.add_all(samples)
        db.commit()
        print(f"Seeded {len(samples)} appointments.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
