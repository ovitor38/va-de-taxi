import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  PreconditionFailedException,
} from '@nestjs/common';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { RideService } from './ride.service';
import { DriverService } from '../driver/driver.service';
import { PassengerService } from '../passenger/passenger.service';
import { StatusRide } from 'src/common/constants';
import { Driver, Passenger, Ride } from '@prisma/client';

describe('RideService', () => {
  let service: RideService;
  let prisma: PrismaService;
  let driverService: DriverService;
  let passengerService: PassengerService;

  const passenger: Passenger = {
    id: 1,
    email: 'joe@email.com',
    name: 'joe',
    phone: '11950403020',
    password: 'secret',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const ride: Ride = {
    id: 1,
    status: StatusRide.waiting,
    origin: 'A',
    destiny: 'B',
    requestDate: new Date(),
    startDate: new Date(),
    finishDate: null,
    driverId: 1,
    passengerId: 1,
  };

  const driver: Driver = {
    id: 1,
    email: 'joe@email.com',
    name: 'joe',
    phone: '11950403020',
    licensePlate: 'aaa0000',
    password: 'secret',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RideService,
        {
          provide: PrismaService,
          useValue: {
            ride: {
              create: jest.fn(),
              findFirstOrThrow: jest.fn(),
              update: jest.fn(),
            },
          },
        },
        { provide: DriverService, useValue: { findOne: jest.fn() } },
        { provide: PassengerService, useValue: { findOne: jest.fn() } },
      ],
    }).compile();

    service = module.get<RideService>(RideService);
    prisma = module.get<PrismaService>(PrismaService);
    driverService = module.get<DriverService>(DriverService);
    passengerService = module.get<PassengerService>(PassengerService);
  });

  describe('create', () => {
    it('should create a ride with valid data', async () => {
      jest.spyOn(passengerService, 'findOne').mockResolvedValue(passenger);
      jest.spyOn(prisma.ride, 'create').mockResolvedValue(ride);

      const result = await service.create({
        origin: 'A',
        destiny: 'B',
        passengerId: 1,
      });

      expect(passengerService.findOne).toHaveBeenCalledWith(1);
      expect(prisma.ride.create).toHaveBeenCalledWith({
        data: { origin: 'A', destiny: 'B', passenger: { connect: { id: 1 } } },
      });
      expect(result).toEqual(ride);
    });
  });

  describe('getOne', () => {
    it('should return a ride by ID', async () => {
      jest.spyOn(prisma.ride, 'findFirstOrThrow').mockResolvedValue(ride);
      const result = await service.getOne(ride.id);
      expect(prisma.ride.findFirstOrThrow).toHaveBeenCalledWith({
        where: { id: ride.id },
      });
      expect(result).toEqual(ride);
    });
  });

  describe('update', () => {
    it('should update ride status to inProgress with valid driverId', async () => {
      jest.spyOn(service, 'getOne').mockResolvedValue(ride);
      jest.spyOn(driverService, 'findOne').mockResolvedValue(driver);
      jest
        .spyOn(prisma.ride, 'update')
        .mockResolvedValue({ ...ride, status: StatusRide.inProgress });

      const result = await service.update(ride.id, {
        status: StatusRide.inProgress,
        driverId: 2,
      });

      expect(service.getOne).toHaveBeenCalledWith(ride.id);
      expect(driverService.findOne).toHaveBeenCalledWith(2);
      expect(prisma.ride.update).toHaveBeenCalledWith({
        where: { id: ride.id },
        data: {
          status: StatusRide.inProgress,
          startDate: expect.any(Date),
          driver: { connect: { id: 2 } },
        },
      });
      expect(result.status).toEqual(StatusRide.inProgress);
    });

    it('should throw PreconditionFailedException if driverId is missing', async () => {
      jest.spyOn(service, 'getOne').mockResolvedValue(ride);
      await expect(
        service.update(ride.id, {
          driverId: null,
          status: StatusRide.inProgress,
        }),
      ).rejects.toThrow(PreconditionFailedException);
    });

    it('should throw BadRequestException for invalid status transition', async () => {
      jest.spyOn(service, 'getOne').mockResolvedValue(ride);
      await expect(
        service.update(ride.id, { driverId: 1, status: StatusRide.waiting }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
