import axios from 'axios';
import {
  getMovies,
  getMovie,
  getGenres,
  getDirectors,
  getActors,
} from './api';
import { describe, it, vi, expect, beforeEach } from 'vitest';

vi.mock('axios');
const mockedAxios = axios as unknown as {
  get: ReturnType<typeof vi.fn>;
};

describe('API service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getMovies calls /movies/ with filters and returns data', async () => {
    const mockData = [{ id: 1, title: 'Inception' }];
    mockedAxios.get = vi.fn().mockResolvedValue({ data: mockData });

    const filters = { genre: 'Sci-Fi' };
    const result = await getMovies(filters);

    expect(mockedAxios.get).toHaveBeenCalledWith(
      'http://localhost:8000/movies/',
      { params: filters }
    );
    expect(result).toEqual(mockData);
  });

  it('getMovie calls /movies/:id and returns data', async () => {
    const mockData = { id: 1, title: 'Inception' };
    mockedAxios.get = vi.fn().mockResolvedValue({ data: mockData });

    const result = await getMovie(1);

    expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:8000/movies/1');
    expect(result).toEqual(mockData);
  });

  it('getGenres calls /genres/ and returns data', async () => {
    const mockData = [{ id: 1, name: 'Action' }];
    mockedAxios.get = vi.fn().mockResolvedValue({ data: mockData });

    const result = await getGenres();

    expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:8000/genres/');
    expect(result).toEqual(mockData);
  });

  it('getDirectors calls /directors/ and returns data', async () => {
    const mockData = [{ id: 1, name: 'Christopher Nolan' }];
    mockedAxios.get = vi.fn().mockResolvedValue({ data: mockData });

    const result = await getDirectors();

    expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:8000/directors/');
    expect(result).toEqual(mockData);
  });

  it('getActors calls /actors/ and returns data', async () => {
    const mockData = [{ id: 1, name: 'Leonardo DiCaprio' }];
    mockedAxios.get = vi.fn().mockResolvedValue({ data: mockData });

    const result = await getActors();

    expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:8000/actors/');
    expect(result).toEqual(mockData);
  });

  it('throws error if getMovies fails', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    mockedAxios.get = vi.fn().mockRejectedValue(new Error('Network error'));
    await expect(getMovies()).rejects.toThrow('Network error');

    consoleSpy.mockRestore();
  });

  it('throws error if getMovie fails', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    mockedAxios.get = vi.fn().mockRejectedValue(new Error('Not Found'));
    await expect(getMovie(99)).rejects.toThrow('Not Found');

    consoleSpy.mockRestore();
  });
});
