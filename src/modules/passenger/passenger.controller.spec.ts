import { Test, TestingModule } from '@nestjs/testing';
import { PassengerController } from './passenger.controller';
import { PassengerService } from './passenger.service';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { UpdatePassengerDto } from './dto/update-passenger.dto';
import { AuthGuard } from '../auth/auth.guard';

describe('PassengerController', () => {
  let controller: PassengerController;
  let passengerService: PassengerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PassengerController],
      providers: [
        {
          provide: PassengerService,
          useValue: {
            create: jest.fn(),
            findOneByEmail: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<PassengerController>(PassengerController);
    passengerService = module.get<PassengerService>(PassengerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(passengerService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new passenger', async () => {
      const createPassengerDto: CreatePassengerDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
        phone: '1234567890',
      };
      const result = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        phone: '1234567890',
      };

      jest.spyOn(passengerService, 'create').mockResolvedValue(result);

      expect(await controller.create(createPassengerDto)).toEqual(result);
      expect(passengerService.create).toHaveBeenCalledWith(createPassengerDto);
    });
  });

  describe('findOne', () => {
    it('should find a passenger by email', async () => {
      const email = 'test@example.com';
      const result = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        phone: '1234567890',
      } as any;

      jest.spyOn(passengerService, 'findOneByEmail').mockResolvedValue(result);

      expect(await controller.findOne(email)).toEqual(result);
      expect(passengerService.findOneByEmail).toHaveBeenCalledWith(email);
    });
  });

  describe('update', () => {
    it('should update the authenticated passenger', async () => {
      const updatePassengerDto: UpdatePassengerDto = { name: 'Updated User' };
      const id = 1;
      const req = { user: { sub: id } } as any;
      const result = {
        id,
        email: 'test@example.com',
        name: 'Updated User',
        phone: '1234567890',
      } as any;

      jest.spyOn(passengerService, 'update').mockResolvedValue(result);

      expect(await controller.update(req, updatePassengerDto)).toEqual(result);
      expect(passengerService.update).toHaveBeenCalledWith(
        id,
        updatePassengerDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove the authenticated passenger', async () => {
      const id = '1';

      jest.spyOn(passengerService, 'delete').mockResolvedValue(undefined);

      expect(await controller.remove(id)).toBeUndefined();
      expect(passengerService.delete).toHaveBeenCalledWith(+id);
    });
  });
});
