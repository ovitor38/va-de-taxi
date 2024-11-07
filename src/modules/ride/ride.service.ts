import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { CreateRideDto } from './dto/create-ride.dto';

@Injectable()
export class RideService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createRideDto: CreateRideDto) {
    const { origin, destiny, passengerId } = createRideDto;

    const ride = await this.prisma.ride.create({
      data: {
        origin,
        destiny,
        passenger: { connect: { id: passengerId } },
      },
    });

    return ride;
  }
}
