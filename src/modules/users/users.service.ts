import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { EntityNotFoundError, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const user = { ...createUserDto, password: hashedPassword };

      return await this.userRepository.save(user);
    } catch (error) {
      if (error.code == 23505 && error.constraint == 'users_email_key')
        throw new ForbiddenException(error.message.replace(/\\|"/g, ''));
    }
  }

  async findOne(id: string): Promise<UserEntity> {
    try {
      return await this.userRepository.findOneOrFail({
        where: {
          id,
        },
      });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException({ message: 'User not found' });
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOneByEmail(email: string): Promise<UserEntity> {
    try {
      return await this.userRepository.findOneOrFail({
        where: {
          email,
        },
      });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException({ message: 'User not found' });
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.findOne(id);

    this.userRepository.merge(user, updateUserDto);

    return await this.userRepository.save(user);
  }

  async remove(id: string) {
    await this.findOne(id);

    return await this.userRepository.softDelete(id);
  }
}
