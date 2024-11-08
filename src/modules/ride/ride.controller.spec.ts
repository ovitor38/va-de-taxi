import { Test, TestingModule } from '@nestjs/testing';
import { RideController } from './ride.controller';
import { RideService } from './ride.service';
import { CreateRideDto } from './dto/create-ride.dto';
import { UpdateRideDto } from './dto/update-ride.dto';
import { StatusRide } from 'src/common/constants';
import { Ride } from '@prisma/client';

describe('RideController', () => {
  let controller: RideController;
  let rideService: RideService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RideController],
      providers: [
        {
          provide: RideService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            getOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RideController>(RideController);
    rideService = module.get<RideService>(RideService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(rideService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new ride', async () => {
      const createRideDto: CreateRideDto = {
        passengerId: 1,
        origin: 'Location A',
        destiny: 'Location B',
      };
      const result = {
        id: 1,
        passengerId: 1,
        status: StatusRide.waiting,
        origin: 'Location A',
        destiny: 'Location B',
        requestDate: new Date(),
      } as any;

      jest.spyOn(rideService, 'create').mockResolvedValue(result);

      expect(await controller.create(createRideDto)).toEqual(result);
      expect(rideService.create).toHaveBeenCalledWith(createRideDto);
    });
  });

  describe('update', () => {
    it('should update a ride', async () => {
      const id = 1;
      const updateRideDto: UpdateRideDto = {
        driverId: 1,
        status: StatusRide.inProgress,
      };
      const result = {
        id: 1,
        passengerId: 1,
        origin: 'Location A',
        destiny: 'Location B',
        requestDate: new Date(),
        ...updateRideDto,
      } as any;

      jest.spyOn(rideService, 'update').mockResolvedValue(result);

      expect(await controller.update(id, updateRideDto)).toEqual(result);
      expect(rideService.update).toHaveBeenCalledWith(id, updateRideDto);
    });
  });
  describe('getOne', () => {
    it('should return a ride with the referenced id', async () => {
      const id = 1;

      const result: Ride = {
        id,
        passengerId: 1,
        driverId: 1,
        origin: 'Location A',
        destiny: 'Location B',
        requestDate: new Date(),
        status: StatusRide.finished,
        startDate: new Date(),
        finishDate: new Date(),
      };
      jest.spyOn(rideService, 'getOne').mockResolvedValue(result);

      expect(await controller.getOne(id)).toEqual(result);
      expect(rideService.getOne).toHaveBeenCalledWith(id);
    });
  });
});
