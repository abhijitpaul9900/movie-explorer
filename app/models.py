from sqlalchemy import Column, Integer, String, ForeignKey, Float
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()

class Movie(Base):
    __tablename__ = 'movies'
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    release_year = Column(Integer)
    review = Column(String)
    rating = Column(Float)
    director_id = Column(Integer, ForeignKey('directors.id'))
    
    director = relationship('Director', back_populates='movies')
    genres = relationship('Genre', secondary='movie_genre', back_populates='movies')
    actors = relationship('Actor', secondary='movie_actor', back_populates='movies')

class Actor(Base):
    __tablename__ = 'actors'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    
    movies = relationship('Movie', secondary='movie_actor')

class Director(Base):
    __tablename__ = 'directors'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    
    movies = relationship('Movie', back_populates='director')

class Genre(Base):
    __tablename__ = 'genres'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    
    movies = relationship('Movie', secondary='movie_genre')

class MovieActor(Base):
    __tablename__ = 'movie_actor'
    
    movie_id = Column(Integer, ForeignKey('movies.id'), primary_key=True)
    actor_id = Column(Integer, ForeignKey('actors.id'), primary_key=True)

class MovieGenre(Base):
    __tablename__ = 'movie_genre'
    
    movie_id = Column(Integer, ForeignKey('movies.id'), primary_key=True)
    genre_id = Column(Integer, ForeignKey('genres.id'), primary_key=True)
