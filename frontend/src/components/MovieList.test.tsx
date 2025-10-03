import { render, screen, waitFor, cleanup } from '@testing-library/react';
import MovieList from './MovieList';
import { getMovies } from '../services/api';
import { describe, it, vi, expect, beforeEach, afterEach } from 'vitest';
import type { Mock } from 'vitest';

// 👇 Mock the API module
vi.mock('../services/api');
const mockedGetMovies = getMovies as Mock;

describe('MovieList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('fetches and displays a list of movies', async () => {
    const mockMovies = [
      {
        id: 1,
        title: 'Inception',
        release_year: 2010,
        rating: 8.8,
        review: 'A mind-bending thriller.',
        director: { id: 1, name: 'Christopher Nolan' },
        genres: [{ id: 1, name: 'Sci-Fi' }, { id: 2, name: 'Thriller' }],
        actors: [],
        description: 'N/A'
      },
      {
        id: 2,
        title: 'The Matrix',
        release_year: 1999,
        rating: 8.7,
        review: 'Neo learns the truth.',
        director: { id: 2, name: 'Lana Wachowski' },
        genres: [{ id: 3, name: 'Action' }, { id: 4, name: 'Sci-Fi' }],
        actors: [],
        description: 'N/A'
      },
    ];

    mockedGetMovies.mockResolvedValue(mockMovies);

    render(<MovieList filters={{}} />);

    await waitFor(() => {
      expect(screen.getByText('Inception')).toBeInTheDocument();
      expect(screen.getByText(/2010/)).toBeInTheDocument();
      expect(screen.getByText(/8.8/)).toBeInTheDocument();
      expect(screen.getByText(/Christopher Nolan/)).toBeInTheDocument();
      expect(screen.getByText(/Sci-Fi, Thriller/)).toBeInTheDocument();
      expect(screen.getByText(/A mind-bending thriller/)).toBeInTheDocument();

      expect(screen.getByText('The Matrix')).toBeInTheDocument();
      expect(screen.getByText(/1999/)).toBeInTheDocument();
      expect(screen.getByText(/8.7/)).toBeInTheDocument();
      expect(screen.getByText(/Lana Wachowski/)).toBeInTheDocument();
      expect(screen.getByText(/Action, Sci-Fi/)).toBeInTheDocument();
      expect(screen.getByText(/Neo learns the truth/)).toBeInTheDocument();
    });
  });

  it('updates movies when filters change', async () => {
    const firstCall = [
      {
        id: 1,
        title: 'Inception',
        release_year: 2010,
        rating: 8.8,
        review: 'Test',
        director: { id: 1, name: 'Nolan' },
        genres: [{ id: 1, name: 'Sci-Fi' }],
        actors: [],
        description: 'Test',
      },
    ];

    const secondCall = [
      {
        id: 2,
        title: 'Interstellar',
        release_year: 2014,
        rating: 8.6,
        review: 'Space travel!',
        director: { id: 1, name: 'Nolan' },
        genres: [{ id: 1, name: 'Sci-Fi' }],
        actors: [],
        description: 'Test',
      },
    ];

    mockedGetMovies
      .mockResolvedValueOnce(firstCall)
      .mockResolvedValueOnce(secondCall);

    const { rerender } = render(<MovieList filters={{ genre: 'Sci-Fi' }} />);

    await waitFor(() => {
      expect(screen.getByText('Inception')).toBeInTheDocument();
    });

    // Trigger re-fetch on filters change
    rerender(<MovieList filters={{ genre: 'Sci-Fi', year: 2014 }} />);

    await waitFor(() => {
      expect(screen.getByText('Interstellar')).toBeInTheDocument();
    });
  });

  it('renders empty list if no movies returned', async () => {
    mockedGetMovies.mockResolvedValue([]);

    render(<MovieList filters={{}} />);

    await waitFor(() => {
      // Since there's no explicit "no movies" message, we check absence
      const movieTitles = screen.queryByText(/Rating:/i);
      expect(movieTitles).not.toBeInTheDocument();
    });
  });
});
