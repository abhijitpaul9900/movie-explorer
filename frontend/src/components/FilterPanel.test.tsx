import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import FilterPanel from './FilterPanel';
import { getGenres, getActors, getDirectors } from '../services/api';
import type { Mock } from 'vitest';

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../services/api');

const mockedGetGenres = getGenres as Mock;
const mockedGetActors = getActors as Mock;
const mockedGetDirectors = getDirectors as Mock;

describe('FilterPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches and displays genres, actors, and directors', async () => {
    mockedGetGenres.mockResolvedValue([
      { id: 1, name: 'Sci-Fi' },
      { id: 2, name: 'Action' },
    ]);
    mockedGetActors.mockResolvedValue([
      { id: 1, name: 'Leonardo DiCaprio' },
      { id: 2, name: 'Tom Hardy' },
    ]);
    mockedGetDirectors.mockResolvedValue([
      { id: 1, name: 'Christopher Nolan' },
    ]);

    const mockOnFilterChange = vi.fn();

    render(<FilterPanel onFilterChange={mockOnFilterChange} />);

    await waitFor(() => {
      expect(screen.getByText('Sci-Fi')).toBeInTheDocument();
      expect(screen.getByText('Tom Hardy')).toBeInTheDocument();
      expect(screen.getByText('Christopher Nolan')).toBeInTheDocument();
    });
  });

  it('calls onFilterChange with selected genre', async () => {
    mockedGetGenres.mockResolvedValue([{ id: 1, name: 'Sci-Fi' }]);
    mockedGetActors.mockResolvedValue([]);
    mockedGetDirectors.mockResolvedValue([]);

    const mockOnFilterChange = vi.fn();

    render(<FilterPanel onFilterChange={mockOnFilterChange} />);

    const genreSelect = await screen.findByLabelText(/Genre/i);
    fireEvent.change(genreSelect, { target: { value: 'Sci-Fi' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith({ genre: 'Sci-Fi' });
  });

  it('calls onFilterChange with selected actor', async () => {
    mockedGetGenres.mockResolvedValue([]);
    mockedGetActors.mockResolvedValue([{ id: 1, name: 'Leo' }]);
    mockedGetDirectors.mockResolvedValue([]);

    const mockOnFilterChange = vi.fn();

    render(<FilterPanel onFilterChange={mockOnFilterChange} />);

    const actorSelect = await screen.findByLabelText(/Actor/i);
    fireEvent.change(actorSelect, { target: { value: 'Leo' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith({ actor: 'Leo' });
  });

  it('calls onFilterChange with selected director', async () => {
    mockedGetGenres.mockResolvedValue([]);
    mockedGetActors.mockResolvedValue([]);
    mockedGetDirectors.mockResolvedValue([{ id: 1, name: 'Nolan' }]);

    const mockOnFilterChange = vi.fn();

    render(<FilterPanel onFilterChange={mockOnFilterChange} />);

    const directorSelect = await screen.findByLabelText(/Director/i);
    fireEvent.change(directorSelect, { target: { value: 'Nolan' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith({ director: 'Nolan' });
  });
});
