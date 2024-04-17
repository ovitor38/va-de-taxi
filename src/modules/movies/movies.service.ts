import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieEntity } from './entities/movie.entity';
import { EntityNotFoundError, Repository } from 'typeorm';
import { CreateMovieDto } from './dto/create-movie.dto';
import { IMovieModel } from './models/movie.model';
import { messagesErrorHelper } from 'src/helpers/messages.helper';
import { IMoviesResponseModel } from './models/movies-response.model';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { RedisCacheService } from '../cache/redis/redis.service';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(MovieEntity)
    private movieRepository: Repository<MovieEntity>,
    private redisCache: RedisCacheService,
  ) {}
  async create(createMovieDto: CreateMovieDto) {
    try {
      const movieData: IMovieModel = {
        ...createMovieDto,
      };

      return await this.movieRepository.save(movieData);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(): Promise<IMoviesResponseModel> {
    try {
      const chachedMoviesData = await this.redisCache.get('movies');

      if (chachedMoviesData) {
        return JSON.parse(chachedMoviesData);
      }
      const movies = await this.movieRepository.find();

      const response = { totalMovies: movies.length, movies };

      await this.redisCache.set('movies', JSON.stringify(response), 'EX', 15);

      return response;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: string): Promise<MovieEntity> {
    try {
      return await this.movieRepository.findOneOrFail({
        where: { id },
      });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException({
          message: messagesErrorHelper.MOVIE_NOT_FOUND,
        });
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: string, updateMovieDto: UpdateMovieDto) {
    try {
      const movie = await this.findOne(id);

      this.movieRepository.merge(movie, updateMovieDto);

      return await this.movieRepository.save(movie);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: string) {
    try {
      return await this.movieRepository.softDelete(id);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
