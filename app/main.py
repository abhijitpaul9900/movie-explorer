from fastapi import FastAPI, Depends, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from contextlib import asynccontextmanager
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import logging
import asyncio
import app_controller as controller
import models_schemas as schemas
import app_utils as utils
from app_utils import get_db
import seed
from models import Base

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Running lifespan...")
    db = None
    for _ in range(5):
        try:
            db = utils.SessionLocal()
            Base.metadata.create_all(bind=utils.engine)
            logger.info("Got DB connection and tables created..")
            break
        except Exception as ex:
            logger.info("Retrying DB connection..")
            await asyncio.sleep(3)
    else:
        logger.error("DB connection failed")
        raise RuntimeError("Failed to connect to DB")

    try:
        seed.seed_data(db)
        logger.info("Seed data inserted..")
    except Exception as e:
        logger.error("Exception during seed data insert.")
        raise(e)
    finally:
        if db:
            db.close()

    yield

app = FastAPI(lifespan=lifespan)

@app.post("/movies/", response_model=schemas.Movie)
def create_movie(movie: schemas.MovieCreate, db: Session = Depends(get_db)):
    return controller.create_movie(db=db, movie=movie)

@app.get("/movies/", response_model=List[schemas.Movie])
def get_movies(skip: int = 0, limit: int = 100, genre: Optional[str] = None,
               director: Optional[str] = None, release_year: Optional[int] = None,
               actor: Optional[str] = None, db: Session = Depends(get_db)):
    return controller.get_movies(db=db, skip=skip, limit=limit, genre=genre, director=director,
                           release_year=release_year, actor=actor)

@app.get("/movies/{movie_id}", response_model=schemas.Movie)
def get_movie(movie_id: int, db: Session = Depends(get_db)):
    db_movie = controller.get_movie(db=db, movie_id=movie_id)
    if db_movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    return db_movie

@app.get("/genres/", response_model=List[schemas.Genre])
def get_actors(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return controller.get_genres(db=db, skip=skip, limit=limit)

@app.get("/actors/", response_model=List[schemas.Actor])
def get_actors(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return controller.get_actors(db=db, skip=skip, limit=limit)

@app.get("/directors/", response_model=List[schemas.Director])
def get_directors(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return controller.get_directors(db=db, skip=skip, limit=limit)


app.mount("/", StaticFiles(directory="static", html=True), name="static")

@app.get("/")
async def root():
    return FileResponse(os.path.join("static", "index.html"))