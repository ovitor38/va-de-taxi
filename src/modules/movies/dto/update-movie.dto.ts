import { PartialType } from '@nestjs/mapped-types';
import { CreateMovieDto } from './create-movie.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMovieDto extends PartialType(CreateMovieDto) {
  @ApiPropertyOptional()
  title?: string;

  @ApiPropertyOptional()
  released?: Date;

  @ApiPropertyOptional()
  director?: string;

  @ApiPropertyOptional()
  duration?: Date;
}
