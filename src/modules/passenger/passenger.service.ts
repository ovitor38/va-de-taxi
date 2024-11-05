import { Injectable } from '@nestjs/common';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { UpdatePassengerDto } from './dto/update-passenger.dto';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { HasherAdapter } from 'src/adapters/hasher/hasher.adapter';

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

    const passenger = await this.prisma.passenger.create(
      ...createPassengerDto,
      hashedPassword,
    );
  }

  findAll() {
    return `This action returns all passenger`;
  }

  async findOneByEmail(email: string) {
    return await this.prisma.passenger.findFirstOrThrow({
      where: { email },
    });
  }

  update(id: number, updatePassengerDto: UpdatePassengerDto) {
    return `This action updates a #${id} passenger`;
  }

  remove(id: number) {
    return `This action removes a #${id} passenger`;
  }
}
