
export interface Genre {
  id: number;
  name: string;
}

export interface Actor {
  id: number;
  name: string;
}

export interface Director {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  title: string;
  release_year: number;
  rating: number;
  review: string;
  description: string;
  genres: Genre[];
  actors: Actor[];
  director: Director;
}

export interface MovieFilterResponse {
  movies: Movie[];
  total: number;
}

