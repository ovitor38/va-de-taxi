import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieEntity } from './entities/movie.entity';
import { Repository } from 'typeorm';
import { CreateMovieDto } from './dto/create-movie.dto';
import { IMovieModel } from './models/movie.model';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(MovieEntity)
    private movieRepository: Repository<MovieEntity>,
  ) {}
  async create(userId: string, createMovieDto: CreateMovieDto) {
    const movieData: IMovieModel = {
      userId,
      ...createMovieDto,
    };

    return await this.movieRepository.save(movieData);
  }

  findAll() {
    return `This action returns all movies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} movie`;
  }

  update(id: number) {
    return `This action updates a #${id} movie`;
  }

  remove(id: number) {
    return `This action removes a #${id} movie`;
  }
}
