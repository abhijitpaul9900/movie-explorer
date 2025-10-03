import os
import logging
import asyncio
import pytest
from contextlib import asynccontextmanager
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

from main import app
from app_utils import get_db
from models import Base

logger = logging.getLogger(__name__)

SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///:memory:?cache=shared&uri=true"

TEST_DATABASE_URL = os.getenv(
    "DATABASE_URL",
    SQLALCHEMY_TEST_DATABASE_URL
)

engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in TEST_DATABASE_URL else {}
)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

@asynccontextmanager
async def override_lifespan(app):
    logger.info("Running test lifespan...")
    for _ in range(5):
        try:
            with TestingSessionLocal() as db:
                Base.metadata.create_all(bind=engine)
            logger.info("Got Test DB connection..")
            logger.info("Test tables created..")
            break
        except Exception as ex:
            logger.info("Retrying DB connection..")
            await asyncio.sleep(3)
    
    yield


@pytest.fixture(scope="function")
def client():
    app.dependency_overrides[get_db] = override_get_db
    app.router.lifespan_context = override_lifespan
    with TestClient(app) as c:
        yield c

def pytest_sessionfinish(session, exitstatus):
    Base.metadata.drop_all(bind=engine)
