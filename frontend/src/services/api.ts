import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const getMovies = async (filters: any = {}) => {
  try {
    const response = await axios.get(`${API_URL}/movies/`, { params: filters });
    return response.data;
  } catch (error) {
    console.error("Error fetching movies", error);
    throw error;
  }
};

export const getMovie = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/movies/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching movie with id ${id}`, error);
    throw error;
  }
};

export const getGenres = async () => {
  try {
    const response = await axios.get(`${API_URL}/genres/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching genres", error);
    throw error;
  }
};

export const getDirectors = async () => {
  try {
    const response = await axios.get(`${API_URL}/directors/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching directors", error);
    throw error;
  }
};

export const getActors = async () => {
  try {
    const response = await axios.get(`${API_URL}/actors/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching actors", error);
    throw error;
  }
};
