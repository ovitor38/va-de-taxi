import { Injectable } from '@nestjs/common';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { PrismaService } from 'src/db/prisma/prisma.service';

@Injectable()
export class DriverService {
  constructor(private readonly prisma: PrismaService) {}

  create(createDriverDto: CreateDriverDto) {
    return 'This action adds a new driver';
  }

  findAll() {
    return `This action returns all driver`;
  }

  async findOneByEmail(email: string) {
    return await this.prisma.driver.findFirstOrThrow({ where: { email } });
  }

  update(id: number, updateDriverDto: UpdateDriverDto) {
    return `This action updates a #${id} driver`;
  }

  remove(id: number) {
    return `This action removes a #${id} driver`;
  }
}
