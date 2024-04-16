import { MovieEntity } from '../entities/movie.entity';

export interface IMoviesResponseModel {
  totalMovies: number;
  movies: MovieEntity[];
}
