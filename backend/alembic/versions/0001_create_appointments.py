"""Alembic initial migration: create appointments table."""

revision = "0001_create_appointments"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    from alembic import op
    import sqlalchemy as sa

    op.create_table(
        "appointments",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("date", sa.Date(), nullable=False),
        sa.Column("start_time", sa.Time(), nullable=False),
        sa.Column("end_time", sa.Time(), nullable=False),
        sa.Column(
            "status",
            sa.Enum("scheduled", "completed", "cancelled", name="appointment_status"),
            nullable=False,
            server_default="scheduled",
        ),
        sa.Column(
            "created_at",
            sa.TIMESTAMP(),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.TIMESTAMP(),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_appointments_date", "appointments", ["date"])
    op.create_index("ix_appointments_id", "appointments", ["id"])
    op.create_index("ix_appointments_status", "appointments", ["status"])


def downgrade() -> None:
    from alembic import op

    op.drop_index("ix_appointments_status", table_name="appointments")
    op.drop_index("ix_appointments_id", table_name="appointments")
    op.drop_index("ix_appointments_date", table_name="appointments")
    op.drop_table("appointments")
    # drop enum type explicitly (MySQL + Postgres safe)
    from sqlalchemy import text
    try:
        op.execute(text("DROP TYPE IF EXISTS appointment_status"))
    except Exception:
        pass
