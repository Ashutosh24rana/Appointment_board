import datetime
from typing import List, Optional

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.appointment import Appointment, AppointmentStatus
from app.schemas.appointment import AppointmentCreate, AppointmentUpdate


def find_overlap(
    db: Session,
    date: datetime.date,
    start_time: datetime.time,
    end_time: datetime.time,
    exclude_id: Optional[int] = None,
) -> Optional[Appointment]:
    """Return the first conflicting *scheduled* appointment on the same date, if any.

    Cancelled (and completed) appointments do not block their slot, so only
    status == 'scheduled' rows are considered. Overlap rule:
        new.start < existing.end AND new.end > existing.start
    """
    q = db.query(Appointment).filter(
        Appointment.date == date,
        Appointment.status == AppointmentStatus.scheduled,
        Appointment.start_time < end_time,
        Appointment.end_time > start_time,
    )
    if exclude_id is not None:
        q = q.filter(Appointment.id != exclude_id)
    return q.first()


def check_overlap_or_raise(
    db: Session,
    date: datetime.date,
    start_time: datetime.time,
    end_time: datetime.time,
    exclude_id: Optional[int] = None,
) -> None:
    conflict = find_overlap(db, date, start_time, end_time, exclude_id)
    if conflict:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                f"Time slot conflicts with '{conflict.title}' "
                f"({conflict.start_time}–{conflict.end_time} on {conflict.date})."
            ),
        )


def list_appointments(
    db: Session,
    date: Optional[datetime.date] = None,
    status_: Optional[AppointmentStatus] = None,
) -> List[Appointment]:
    q = db.query(Appointment)
    if date is not None:
        q = q.filter(Appointment.date == date)
    if status_ is not None:
        q = q.filter(Appointment.status == status_)
    return q.order_by(Appointment.date.asc(), Appointment.start_time.asc()).all()


def get_appointment_or_404(db: Session, appointment_id: int) -> Appointment:
    appt = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Appointment with id {appointment_id} not found.",
        )
    return appt


def ensure_editable(appt: Appointment) -> None:
    if appt.status != AppointmentStatus.scheduled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"Only scheduled appointments can be edited "
                f"(current status: '{appt.status.value}')."
            ),
        )


def create_appointment(db: Session, payload: AppointmentCreate) -> Appointment:
    check_overlap_or_raise(db, payload.date, payload.start_time, payload.end_time)
    appt = Appointment(
        title=payload.title,
        description=payload.description,
        date=payload.date,
        start_time=payload.start_time,
        end_time=payload.end_time,
        status=AppointmentStatus.scheduled,
    )
    db.add(appt)
    db.commit()
    db.refresh(appt)
    return appt


def update_appointment(
    db: Session, appointment_id: int, payload: AppointmentUpdate
) -> Appointment:
    appt = get_appointment_or_404(db, appointment_id)
    ensure_editable(appt)
    check_overlap_or_raise(
        db, payload.date, payload.start_time, payload.end_time, exclude_id=appt.id
    )
    appt.title = payload.title
    appt.description = payload.description
    appt.date = payload.date
    appt.start_time = payload.start_time
    appt.end_time = payload.end_time
    db.commit()
    db.refresh(appt)
    return appt


def complete_appointment(db: Session, appointment_id: int) -> Appointment:
    appt = get_appointment_or_404(db, appointment_id)
    if appt.status == AppointmentStatus.completed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Appointment is already completed.",
        )
    if appt.status == AppointmentStatus.cancelled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cancelled appointments cannot be marked as completed.",
        )
    appt.status = AppointmentStatus.completed
    db.commit()
    db.refresh(appt)
    return appt


def cancel_appointment(db: Session, appointment_id: int) -> Appointment:
    appt = get_appointment_or_404(db, appointment_id)
    if appt.status == AppointmentStatus.cancelled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Appointment is already cancelled.",
        )
    if appt.status == AppointmentStatus.completed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Completed appointments cannot be cancelled.",
        )
    appt.status = AppointmentStatus.cancelled
    db.commit()
    db.refresh(appt)
    return appt
