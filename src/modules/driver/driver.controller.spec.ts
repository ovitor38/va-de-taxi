import { Test, TestingModule } from '@nestjs/testing';
import { DriverController } from './driver.controller';
import { DriverService } from './driver.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

describe('DriverController', () => {
  let controller: DriverController;
  let service: DriverService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DriverController],
      providers: [
        {
          provide: DriverService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: jest.fn((context: ExecutionContext) => {
          const request = context.switchToHttp().getRequest<Request>();
          request['user'] = { sub: 1 }; // Simula um usuário autenticado com ID 1
          return true;
        }),
      })
      .compile();

    controller = module.get<DriverController>(DriverController);
    service = module.get<DriverService>(DriverService);
  });

  describe('create', () => {
    it('deve criar um novo motorista com dados válidos', async () => {
      const createDriverDto: CreateDriverDto = {
        email: 'john.doe@example.com',
        password: 'password123',
        name: 'John Doe',
        phone: '1234567890',
        licensePlate: 'ABC1234',
      };

      const expectedDriver = {
        id: 1,
        email: createDriverDto.email,
        name: createDriverDto.name,
        phone: createDriverDto.phone,
        licensePlate: createDriverDto.licensePlate,
      };

      jest.spyOn(service, 'create').mockResolvedValue(expectedDriver);

      const result = await controller.create(createDriverDto);
      expect(result).toEqual(expectedDriver);
      expect(service.create).toHaveBeenCalledWith(createDriverDto);
    });
  });

  describe('update', () => {
    it('deve atualizar os dados do motorista autenticado', async () => {
      const updateDriverDto: UpdateDriverDto = {
        name: 'John Updated',
        phone: '0987654321',
      };

      const updatedDriver = {
        id: 1,
        email: 'john.doe@example.com',
        name: updateDriverDto.name,
        phone: updateDriverDto.phone,
        licensePlate: 'ABC1234',
      };

      jest.spyOn(service, 'update').mockResolvedValue(updatedDriver as any);

      const req = { user: { sub: 1 } } as any;
      const result = await controller.update(req, updateDriverDto);
      expect(result).toEqual(updatedDriver);
      expect(service.update).toHaveBeenCalledWith(1, updateDriverDto);
    });
  });

  describe('remove', () => {
    it('deve remover o motorista autenticado', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      const req = { user: { sub: 1 } } as any;
      const result = await controller.remove(req);
      expect(result).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
