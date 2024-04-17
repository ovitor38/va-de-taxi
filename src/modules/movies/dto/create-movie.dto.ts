import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateMovieDto {
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  released: Date;

  @ApiProperty()
  @IsNotEmpty()
  director: string;

  @ApiProperty()
  @IsNotEmpty()
  duration: Date;
}
