import { Injectable } from '@nestjs/common';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { HasherAdapter } from 'src/adapters/hasher/hasher.adapter';

@Injectable()
export class DriverService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hasherAdapter: HasherAdapter,
  ) {}

  async create(createDriverDto: CreateDriverDto) {
    const hashedPassword = await this.hasherAdapter.hash(
      createDriverDto.password,
    );

    const driverDto = {
      ...createDriverDto,
      password: hashedPassword,
    };

    const user = await this.prisma.driver.create({
      data: driverDto,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        licensePlate: true,
      },
    });

    return user;
  }

  async findOneByEmail(email: string) {
    return await this.prisma.driver.findFirstOrThrow({ where: { email } });
  }

  async findOne(id: number) {
    return await this.prisma.driver.findFirstOrThrow({ where: { id } });
  }

  async update(id: number, updateDriverDto: UpdateDriverDto) {
    return await this.prisma.driver.update({
      where: { id },
      data: updateDriverDto,
    });
  }

  async remove(id: number): Promise<void> {
    await this.prisma.driver.delete({ where: { id } });
  }
}
