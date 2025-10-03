from conftest import override_get_db
from models import Director, Genre, Actor

def test_get_movies_empty(client):
    """GET /movies/ :: empty list."""
    resp = client.get("/movies/")
    assert resp.status_code == 200
    assert resp.json() == []

def test_create_and_get_movie(client):
    """Create movie :: get the list."""
    db = next(override_get_db()) 

    director = Director(name="Christopher Nolan")
    db.add(director)
    db.commit()
    db.refresh(director)

    genre = Genre(name="Sci-Fi")
    db.add(genre)
    db.commit()
    db.refresh(genre)

    actor = Actor(name="Leonardo DiCaprio")
    db.add(actor)
    db.commit()
    db.refresh(actor)
    
    movie_payload = {
        "title": "Inception",
        "release_year": 2010,
        "rating": 8.8,
        "review": "Great movie",
        "genre_ids": [genre.id],
        "actor_ids": [actor.id],
        "director_id": director.id
    }
    resp_movie = client.post("/movies/", json=movie_payload)
    assert resp_movie.status_code == 200
    data = resp_movie.json()
    assert data["title"] == "Inception"
    assert data["rating"] == 8.8
    assert "id" in data
    assert data["director"]["id"] == director.id
    assert len(data["genres"]) == 1
    assert data["genres"][0]["id"] == genre.id
    assert len(data["actors"]) == 1
    assert data["actors"][0]["id"] == actor.id
    resp2 = client.get("/movies/")
    assert resp2.status_code == 200
    arr = resp2.json()
    assert isinstance(arr, list)
    assert len(arr) == 1
    assert arr[0]["title"] == "Inception"
