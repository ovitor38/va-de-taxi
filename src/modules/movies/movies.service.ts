import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieEntity } from './entities/movie.entity';
import { EntityNotFoundError, Repository } from 'typeorm';
import { CreateMovieDto } from './dto/create-movie.dto';
import { IMovieModel } from './models/movie.model';
import { messagesErrorHelper } from 'src/helpers/messages.helper';

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

  findAll() {
    return `This action returns all movies`;
  }

  async findOne(id: string) {
    try {
      const movie = await this.movieRepository.findOneOrFail({
        where: { id },
      });
      return movie;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException({
          message: messagesErrorHelper.MOVIE_NOT_FOUND,
        });
      }

      throw error;
    }
  }

  update(id: number) {
    return `This action updates a #${id} movie`;
  }

  remove(id: number) {
    return `This action removes a #${id} movie`;
  }
}
