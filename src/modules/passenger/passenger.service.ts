import { Injectable } from '@nestjs/common';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { HasherAdapter } from 'src/adapters/hasher/hasher.adapter';
import { UpdatePassengerDto } from './dto/update-passenger.dto';

@Injectable()
export class PassengerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hasherAdapter: HasherAdapter,
  ) {}

  async create(createPassengerDto: CreatePassengerDto) {
    const hashedPassword = await this.hasherAdapter.hash(
      createPassengerDto.password,
    );

    const passengerDto = { ...createPassengerDto, password: hashedPassword };

    const passenger = await this.prisma.passenger.create({
      data: passengerDto,
      select: { id: true, email: true, name: true, phone: true },
    });

    return passenger;
  }

  async findOneByEmail(email: string) {
    return await this.prisma.passenger.findFirstOrThrow({
      where: { email },
    });
  }

  async findOne(id: number) {
    return await this.prisma.passenger.findFirstOrThrow({
      where: { id },
    });
  }

  async update(id: number, updatePassengerDto: UpdatePassengerDto) {
    const passengerUpdated = await this.prisma.passenger.update({
      where: { id },
      data: updatePassengerDto,
    });

    return passengerUpdated;
  }

  async delete(id: number) {
    await this.prisma.passenger.delete({ where: { id } });
  }
}
