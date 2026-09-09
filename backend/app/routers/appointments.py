import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.crud import appointment as crud
from app.database import get_db
from app.models.appointment import AppointmentStatus
from app.schemas.appointment import (
    AppointmentCreate,
    AppointmentResponse,
    AppointmentUpdate,
)

router = APIRouter(prefix="/appointments", tags=["appointments"])


def parse_status(status_: Optional[str]) -> Optional[AppointmentStatus]:
    if status_ in (None, ""):
        return None
    try:
        return AppointmentStatus(status_)
    except ValueError:
        from fastapi import HTTPException, status as http_status

        raise HTTPException(
            status_code=http_status.HTTP_400_BAD_REQUEST,
            detail="Invalid status. Must be one of: scheduled, completed, cancelled.",
        )


@router.get("", response_model=List[AppointmentResponse])
def list_appointments(
    date: Optional[datetime.date] = Query(default=None),
    status: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
):
    status_enum = parse_status(status)
    return crud.list_appointments(db, date=date, status_=status_enum)


@router.post("", response_model=AppointmentResponse, status_code=201)
def create_appointment(payload: AppointmentCreate, db: Session = Depends(get_db)):
    return crud.create_appointment(db, payload)


@router.put("/{appointment_id}", response_model=AppointmentResponse)
def update_appointment(
    appointment_id: int, payload: AppointmentUpdate, db: Session = Depends(get_db)
):
    return crud.update_appointment(db, appointment_id, payload)


@router.patch("/{appointment_id}/complete", response_model=AppointmentResponse)
def complete_appointment(appointment_id: int, db: Session = Depends(get_db)):
    return crud.complete_appointment(db, appointment_id)


@router.patch("/{appointment_id}/cancel", response_model=AppointmentResponse)
def cancel_appointment(appointment_id: int, db: Session = Depends(get_db)):
    return crud.cancel_appointment(db, appointment_id)
