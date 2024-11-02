import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length, MinLength } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty()
  @IsNotEmpty()
  @Length(3, 200)
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(10)
  description: string;
}
