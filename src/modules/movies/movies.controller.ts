import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';
@UseGuards(AuthGuard)
@Controller('api/movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  //@UseGuards(AuthGuard)
  @Post()
  create(@Req() req: Request, @Body() createMovieDto: CreateMovieDto) {
    const userId: string = req['user'].sub;

    return this.moviesService.create(userId, createMovieDto);
  }

  @Get()
  findAll() {
    return this.moviesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.moviesService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.moviesService.remove(+id);
  }
}
