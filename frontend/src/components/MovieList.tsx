import React, { useEffect, useState } from 'react';
import { Movie } from '../types';
import { getMovies } from '../services/api';

interface MovieListProps {
  filters: any;
}

const MovieList = ({ filters }: MovieListProps) => {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const movies = await getMovies(filters);
      setMovies(movies);
    };

    fetchMovies();
  }, [filters]);

  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold text-yellow-400 mb-6">Movie List</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <h2 className="movie-title">{movie.title}<span className="movie-meta mt-1">  ({movie.release_year})</span></h2>
            <p className="movie-meta mt-1">Rating: <span className="text-yellow-400">{movie.rating}</span></p>
            <p className="movie-meta mt-1">Directed by: <span className="text-gray-300">{movie.director.name}</span></p>
            <p className="movie-meta mt-1">
              Genres:{" "}
              <span className="text-gray-300">
                {movie.genres.map((genre) => genre.name).join(', ')}
              </span>
            </p>
            <p className="movie-meta mt-1">{movie.review}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieList;
