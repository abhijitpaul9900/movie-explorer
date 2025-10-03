import React, { useEffect, useState } from 'react';
import { getGenres, getActors, getDirectors } from '../services/api';
import { Genre, Actor, Director } from '../types';

interface FilterPanelProps {
  onFilterChange: (filters: any) => void;
}

const FilterPanel = ({ onFilterChange }: FilterPanelProps) => {

  const [genres, setGenres] = useState<Genre[]>([]);
  const [actors, setActors] = useState<Actor[]>([]);
  const [directors, setDirectors] = useState<Director[]>([]);

  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [selectedActor, setSelectedActor] = useState<string>('');
  const [selectedDirector, setSelectedDirector] = useState<string>('');

  useEffect(() => {
    getGenres().then(setGenres).catch(console.error);
    getActors().then(setActors).catch(console.error);
    getDirectors().then(setDirectors).catch(console.error);
  }, []);
 
  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGenre(e.target.value);
    onFilterChange({ genre: e.target.value });
  };

 
  const handleActorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedActor(e.target.value);
    onFilterChange({ actor: e.target.value });
  };

 
  const handleDirectorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDirector(e.target.value);
    onFilterChange({ director: e.target.value });
  };

  return (
    <div className="filter-panel flex flex-col md:flex-row items-center gap-4 p-4 bg-gray-800 rounded">
      <h2 className="block w-full text-xl font-semibold mb-4 text-yellow-400">Filters</h2>

      <div className="filter-option flex items-center gap-2 w-full md:w-auto">
        <label htmlFor="genre" className="text-sm text-white">Genre</label>
        <select
          id="genre"
          value={selectedGenre}
          onChange={handleGenreChange}
          className="p-2 border border-gray-300 text-gray-900 rounded w-full md:w-auto"
        >
          <option value="">Select Genre</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.name}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-option flex items-center gap-2 w-full md:w-auto">
        <label htmlFor="actor" className="block mb-2 text-sm text-white">Actor</label>
        <select
          id="actor"
          value={selectedActor}
          onChange={handleActorChange}
          className="p-2 border border-gray-300 text-gray-900 rounded w-full md:w-auto"
        >
          <option value="">Select Actor</option>
          {actors.map((actor) => (
            <option key={actor.id} value={actor.name}>
              {actor.name}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-option flex items-center gap-2 w-full md:w-auto">
        <label htmlFor="director" className="block mb-2 text-sm text-white">Director</label>
        <select
          id="director"
          value={selectedDirector}
          onChange={handleDirectorChange}
          className="p-2 border border-gray-300 text-gray-900 rounded w-full md:w-auto"
        >
          <option value="">Select Director</option>
          {directors.map((director) => (
            <option key={director.id} value={director.name}>
              {director.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterPanel;
