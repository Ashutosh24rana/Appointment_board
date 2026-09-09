
import datetime

def times_overlap(
    new_start: datetime.time,
    new_end: datetime.time,
    existing_start: datetime.time,
    existing_end: datetime.time,
) -> bool:
    """Overlap check: new.start < existing.end AND new.end > existing.start."""
    return new_start < existing_end and new_end > existing_start


def ensure_end_after_start(start: datetime.time, end: datetime.time) -> None:
    if end <= start:
        raise ValueError("end_time must be after start_time.")
