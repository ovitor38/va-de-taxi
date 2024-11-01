import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty()
  @IsNotEmpty()
  @Length(3, 200)
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;
}
