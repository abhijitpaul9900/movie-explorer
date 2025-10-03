from sqlalchemy.orm import Session
import models
from models import Movie, Genre, Actor, Director  # import correct classes

def get_or_create(session: Session, model, **kwargs):
    """Get existing object or create it."""
    instance = session.query(model).filter_by(**kwargs).first()
    if instance:
        return instance
    instance = model(**kwargs)
    session.add(instance)
    session.commit()
    session.refresh(instance)
    return instance

def seed_data(db: Session):
    existing = db.query(models.Movie).first()
    if existing:
        return

    genre_names = ["Action", "Drama", "Comedy", "Sci-Fi", "Thriller", "Adventure", "Biography", "Crime"]
    genre_objs = {}
    for name in genre_names:
        g = get_or_create(db, Genre, name=name)
        genre_objs[name] = g
    director_names = ["Christopher Nolan", "Steven Spielberg", "Martin Scorsese", "Satyajit Ray", "James Cameron"]
    director_objs = {}
    for name in director_names:
        d = get_or_create(db, Director, name=name)
        director_objs[name] = d
    actor_names = [
        "Leonardo DiCaprio",
        "Matthew McConaughey",
        "Tom Hanks",
        "Morgan Freeman",
        "Christian Bale",
        "Kate Winslet",
        "Anne Hathaway",
        "Joseph Gordon-Levitt",
        "Ben Kingsley",
        "Amitabh Bachchan"
    ]
    actor_objs = {}
    for name in actor_names:
        a = get_or_create(db, Actor, name=name)
        actor_objs[name] = a
    movie_data = [
        {
            "title": "Inception",
            "release_year": 2010,
            "rating": 8.8,
            "review": "A mind-bending thriller with stunning visuals.",
            "director": "Christopher Nolan",
            "actors": ["Leonardo DiCaprio", "Joseph Gordon-Levitt"],
            "genres": ["Action", "Sci-Fi", "Thriller"]
        },
        {
            "title": "Interstellar",
            "release_year": 2014,
            "rating": 8.6,
            "review": "Explores time, space, and love across dimensions.",
            "director": "Christopher Nolan",
            "actors": ["Matthew McConaughey", "Anne Hathaway"],
            "genres": ["Adventure", "Drama", "Sci-Fi"]
        },
        {
            "title": "The Wolf of Wall Street",
            "release_year": 2013,
            "rating": 8.2,
            "review": "Raucous and energetic — a plunge into excess.",
            "director": "Martin Scorsese",
            "actors": ["Leonardo DiCaprio"],
            "genres": ["Comedy", "Drama"]
        },
        {
            "title": "Catch Me If You Can",
            "release_year": 2002,
            "rating": 8.1,
            "review": "Cat-and-mouse game based on a true story.",
            "director": "Steven Spielberg",
            "actors": ["Leonardo DiCaprio", "Tom Hanks"],
            "genres": ["Biography", "Crime", "Drama"]
        },
        {
            "title": "Pather Panchali",
            "release_year": 1955,
            "rating": 8.5,
            "review": "A poetic depiction of rural life and innocence.",
            "director": "Satyajit Ray",
            "actors": [],
            "genres": ["Drama"]
        }
    ]

    for md in movie_data:
        if db.query(Movie).filter_by(title=md["title"]).first():
            continue

        director = director_objs.get(md["director"])
        movie = Movie(
            title=md["title"],
            release_year=md["release_year"],
            rating=md["rating"],
            review=md.get("review", ""),
            director=director
        )
        for actor_name in md["actors"]:
            actor = actor_objs.get(actor_name)
            if actor:
                movie.actors.append(actor)
        for genre_name in md["genres"]:
            genre = genre_objs.get(genre_name)
            if genre:
                movie.genres.append(genre)

        db.add(movie)
        db.commit()
        db.refresh(movie)
