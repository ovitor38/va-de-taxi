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

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(MovieEntity)
    private movieRepository: Repository<MovieEntity>,
  ) {}
  async create(createMovieDto: CreateMovieDto) {
    const movieData: IMovieModel = {
      ...createMovieDto,
    };

    return await this.movieRepository.save(movieData);
  }

  async findAll(): Promise<IMoviesResponseModel> {
    try {
      const movies = await this.movieRepository.find();

      const response = { totalMovies: movies.length, movies };

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
      await this.findOne(id);

      return await this.movieRepository.update(id, updateMovieDto);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: string) {
    return await this.movieRepository.softDelete(id);
  }
}
