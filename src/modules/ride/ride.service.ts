import {
  BadRequestException,
  Injectable,
  PreconditionFailedException,
} from '@nestjs/common';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { CreateRideDto } from './dto/create-ride.dto';
import { UpdateRideDto } from './dto/update-ride.dto';
import { StatusRide } from 'src/common/constants';
import { DriverService } from '../driver/driver.service';
import { PassengerService } from '../passenger/passenger.service';

@Injectable()
export class RideService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly driverService: DriverService,
    private readonly passengerService: PassengerService,
  ) {}

  async create(createRideDto: CreateRideDto) {
    const { origin, destiny, passengerId } = createRideDto;

    const passenger = await this.passengerService.findOne(passengerId);

    const ride = await this.prisma.ride.create({
      data: {
        origin,
        destiny,
        passenger: { connect: { id: passenger.id } },
      },
    });

    return ride;
  }

  async getOne(id: number) {
    const ride = await this.prisma.ride.findFirstOrThrow({ where: { id } });

    return ride;
  }

  async update(id: number, updateRideDto: UpdateRideDto) {
    const ride = await this.getOne(id);

    if (
      updateRideDto.status === (StatusRide.inProgress as StatusRide) &&
      ride.status === (StatusRide.waiting as StatusRide)
    ) {
      if (!updateRideDto.driverId) {
        throw new PreconditionFailedException('Driver ID is not valid');
      }

      await this.driverService.findOne(updateRideDto.driverId);

      return await this.prisma.ride.update({
        where: { id },
        data: {
          status: StatusRide.inProgress,
          startDate: new Date(),
          driver: { connect: { id: updateRideDto.driverId } },
        },
      });
    }

    if (
      updateRideDto.status === (StatusRide.finished as StatusRide) &&
      ride.status === (StatusRide.inProgress as StatusRide)
    ) {
      return await this.prisma.ride.update({
        where: { id },
        data: {
          status: StatusRide.finished,
          finishDate: new Date(),
        },
      });
    }

    throw new BadRequestException('No valid status change.');
  }
}
