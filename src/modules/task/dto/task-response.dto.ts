import { ApiProperty } from '@nestjs/swagger';

export class TaskResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'buy flowers' })
  title: string;

  @ApiProperty({ example: 'buy flowers at 18pm for my girlfriend' })
  description: string;

  @ApiProperty({ example: false })
  finished: boolean;

  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: '2023-01-01T00:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2023-01-01T00:00:00Z' })
  updatedAt: Date;
}
