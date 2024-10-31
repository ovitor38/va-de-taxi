import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HasherAdapter } from '../../adapters/hasher/hasher.adapter';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hasherAdapter: HasherAdapter,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const hashedPassword = await this.hasherAdapter.hash(
      createUserDto.password,
    );
    const user = { ...createUserDto, password: hashedPassword };

    return await this.prisma.user.create({
      data: user,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: number): Promise<UserResponseDto> {
    return await this.prisma.user.findFirstOrThrow({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.prisma.user.findFirstOrThrow({
      where: { email },
    });
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: number) {
    return await this.prisma.user.delete({ where: { id } });
  }
}
