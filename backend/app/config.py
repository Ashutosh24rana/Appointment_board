from pathlib import Path

from pydantic_settings import BaseSettings

# app/config.py -> app -> backend -> project root
ROOT_ENV = Path(__file__).resolve().parents[2] / ".env"


class Settings(BaseSettings):
    DATABASE_URL: str
    APP_NAME: str = "Appointment Board API"
    FRONTEND_URL: str

    class Config:
        env_file = str(ROOT_ENV)
        extra = "ignore"

    def sqlalchemy_url(self) -> str:
        url = self.DATABASE_URL.strip().strip('"').strip("'")
        # SQLAlchemy needs an explicit driver for MySQL
        if url.startswith("mysql://"):
            url = url.replace("mysql://", "mysql+pymysql://", 1)
        return url


settings = Settings()
