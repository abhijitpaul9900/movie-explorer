from sqlalchemy.orm import Session
from typing import Optional
import models
import models_schemas as schemas

def create_movie(db: Session, movie: schemas.MovieCreate):
    db_movie = models.Movie(
        title=movie.title,
        release_year=movie.release_year,
        rating=movie.rating, 
        review=movie.review,
        director_id=movie.director_id
    )
    db.add(db_movie)
    db.commit()
    db.refresh(db_movie)

    for genre_id in movie.genre_ids:
        db_genre = db.query(models.Genre).filter(models.Genre.id == genre_id).first()
        db_movie.genres.append(db_genre)
    for actor_id in movie.actor_ids:
        db_actor = db.query(models.Actor).filter(models.Actor.id == actor_id).first()
        db_movie.actors.append(db_actor)

    db.commit()
    db.refresh(db_movie)
    return db_movie

def get_movies(db: Session, skip: int = 0, limit: int = 100, genre: Optional[str] = None,
               director: Optional[str] = None, release_year: Optional[int] = None, actor: Optional[str] = None):
    query = db.query(models.Movie)
    if genre:
        query = query.filter(models.Movie.genres.any(models.Genre.name == genre))
    if director:
        query = query.filter(models.Movie.director.has(models.Director.name == director))
    if release_year:
        query = query.filter(models.Movie.release_year == release_year)
    if actor:
        query = query.filter(models.Movie.actors.any(models.Actor.name == actor))
    
    return query.offset(skip).limit(limit).all()

def get_movie(db: Session, movie_id: int):
    return db.query(models.Movie).filter(models.Movie.id == movie_id).first()

def get_genres(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Genre).offset(skip).limit(limit).all()

def get_actors(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Actor).offset(skip).limit(limit).all()

def get_directors(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Director).offset(skip).limit(limit).all()
