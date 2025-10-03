from pydantic import BaseModel, ConfigDict
from typing import List, Optional

class GenreBase(BaseModel):
    name: str

class Genre(GenreBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

class ActorBase(BaseModel):
    name: str
    bio: Optional[str] = None

class Actor(ActorBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

class DirectorBase(BaseModel):
    name: str
    bio: Optional[str] = None

class Director(DirectorBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

class MovieBase(BaseModel):
    title: str
    release_year: int
    description: Optional[str] = None
    rating: float
    review: str
    genre_ids: List[int]
    actor_ids: List[int]
    director_id: int

class MovieCreate(MovieBase):
    pass

class Movie(MovieBase):
    id: int
    genres: List[Genre] = []
    actors: List[Actor] = []
    director: Director

    genre_ids: Optional[List[int]] = None
    actor_ids: Optional[List[int]] = None

    model_config = ConfigDict(from_attributes=True)
