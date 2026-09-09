import datetime
from typing import Optional

from pydantic import BaseModel, field_validator, model_validator

from app.models.appointment import AppointmentStatus


class AppointmentBase(BaseModel):
    title: str
    description: Optional[str] = None
    date: datetime.date
    start_time: datetime.time
    end_time: datetime.time


class AppointmentCreate(AppointmentBase):
    @field_validator("title")
    @classmethod
    def title_required(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Title is required.")
        if len(v.strip()) > 255:
            raise ValueError("Title must be at most 255 characters.")
        return v.strip()

    @field_validator("date")
    @classmethod
    def date_not_in_past(cls, v: datetime.date) -> datetime.date:
        if v < datetime.date.today():
            raise ValueError("Date cannot be in the past.")
        return v

    @model_validator(mode="after")
    def check_times(self):
        if self.start_time is not None and self.end_time is not None:
            if self.end_time <= self.start_time:
                raise ValueError("end_time must be after start_time.")
            if self.date == datetime.date.today():
                now = datetime.datetime.now().time().replace(microsecond=0)
                if self.end_time <= now:
                    raise ValueError("This time slot has already passed today.")
        return self


class AppointmentUpdate(AppointmentCreate):
    pass  # same validation rules as create


class AppointmentResponse(AppointmentBase):
    id: int
    status: AppointmentStatus
    created_at: datetime.datetime
    updated_at: datetime.datetime

    class Config:
        from_attributes = True
