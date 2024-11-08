import { Test, TestingModule } from '@nestjs/testing';
import { DriverService } from './driver.service';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { HasherAdapter } from 'src/adapters/hasher/hasher.adapter';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';

describe('DriverService', () => {
  let service: DriverService;
  let prisma: PrismaService;
  let hasherAdapter: HasherAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DriverService,
        {
          provide: PrismaService,
          useValue: {
            driver: {
              create: jest.fn(),
              findFirstOrThrow: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
        {
          provide: HasherAdapter,
          useValue: {
            hash: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DriverService>(DriverService);
    prisma = module.get<PrismaService>(PrismaService);
    hasherAdapter = module.get<HasherAdapter>(HasherAdapter);
  });

  describe('create', () => {
    it('deve criar um motorista com dados válidos', async () => {
      const createDriverDto: CreateDriverDto = {
        email: 'john.doe@example.com',
        password: 'password123',
        name: 'John Doe',
        phone: '1234567890',
        licensePlate: 'ABC1234',
      };

      const hashedPassword = 'hashedpassword123';
      jest.spyOn(hasherAdapter, 'hash').mockResolvedValue(hashedPassword);

      const expectedDriver = {
        id: 1,
        email: createDriverDto.email,
        name: createDriverDto.name,
        phone: createDriverDto.phone,
        licensePlate: createDriverDto.licensePlate,
      };

      jest
        .spyOn(prisma.driver, 'create')
        .mockResolvedValue(expectedDriver as any);

      const result = await service.create(createDriverDto);
      expect(result).toEqual(expectedDriver);
      expect(prisma.driver.create).toHaveBeenCalledWith({
        data: { ...createDriverDto, password: hashedPassword },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          licensePlate: true,
        },
      });
    });
  });

  describe('findOneByEmail', () => {
    it('deve retornar um motorista pelo email', async () => {
      const email = 'john.doe@example.com';
      const expectedDriver = {
        id: 1,
        email,
        name: 'John Doe',
        phone: '1234567890',
        licensePlate: 'ABC1234',
      };

      jest
        .spyOn(prisma.driver, 'findFirstOrThrow')
        .mockResolvedValue(expectedDriver as any);

      const result = await service.findOneByEmail(email);
      expect(result).toEqual(expectedDriver);
      expect(prisma.driver.findFirstOrThrow).toHaveBeenCalledWith({
        where: { email },
      });
    });
  });

  describe('findOne', () => {
    it('deve retornar um motorista pelo ID', async () => {
      const id = 1;
      const expectedDriver = {
        id,
        email: 'john.doe@example.com',
        name: 'John Doe',
        phone: '1234567890',
        licensePlate: 'ABC1234',
      };

      jest
        .spyOn(prisma.driver, 'findFirstOrThrow')
        .mockResolvedValue(expectedDriver as any);

      const result = await service.findOne(id);
      expect(result).toEqual(expectedDriver);
      expect(prisma.driver.findFirstOrThrow).toHaveBeenCalledWith({
        where: { id },
      });
    });
  });

  describe('update', () => {
    it('deve atualizar os dados de um motorista pelo ID', async () => {
      const id = 1;
      const updateDriverDto: UpdateDriverDto = {
        name: 'John Updated',
        phone: '0987654321',
      };

      const updatedDriver = {
        id,
        email: 'john.doe@example.com',
        name: updateDriverDto.name,
        phone: updateDriverDto.phone,
        licensePlate: 'ABC1234',
      };

      jest
        .spyOn(prisma.driver, 'update')
        .mockResolvedValue(updatedDriver as any);

      const result = await service.update(id, updateDriverDto);
      expect(result).toEqual(updatedDriver);
      expect(prisma.driver.update).toHaveBeenCalledWith({
        where: { id },
        data: updateDriverDto,
      });
    });
  });

  describe('remove', () => {
    it('deve remover um motorista pelo ID', async () => {
      const id = 1;
      jest.spyOn(prisma.driver, 'delete').mockResolvedValue(undefined);

      await service.remove(id);
      expect(prisma.driver.delete).toHaveBeenCalledWith({ where: { id } });
    });
  });
});
