import { Test, TestingModule } from '@nestjs/testing';
import { PassengerService } from './passenger.service';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { HasherAdapter } from 'src/adapters/hasher/hasher.adapter';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { UpdatePassengerDto } from './dto/update-passenger.dto';
import { Passenger } from '@prisma/client';

describe('PassengerService', () => {
  let service: PassengerService;
  let prisma: PrismaService;
  let hasherAdapter: HasherAdapter;

  const createPassengerDto: CreatePassengerDto = {
    email: 'jane.doe@example.com',
    name: 'Jane Doe',
    phone: '1234567890',
    password: 'plaintextpassword',
  };

  const hashedPassword = 'hashedpassword123';

  const passenger: Passenger = {
    id: 1,
    email: createPassengerDto.email,
    name: createPassengerDto.name,
    phone: createPassengerDto.phone,
    password: hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const passengerWithoutPassword = {
    id: passenger.id,
    email: passenger.email,
    name: passenger.name,
    phone: passenger.phone,
  };

  const updatedPassenger: Passenger = {
    ...passenger,
    name: 'Jane Smith',
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PassengerService,
        {
          provide: PrismaService,
          useValue: {
            passenger: {
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

    service = module.get<PassengerService>(PassengerService);
    prisma = module.get<PrismaService>(PrismaService);
    hasherAdapter = module.get<HasherAdapter>(HasherAdapter);
  });

  describe('create', () => {
    it('deve criar um passageiro com dados válidos', async () => {
      jest.spyOn(hasherAdapter, 'hash').mockResolvedValue(hashedPassword);
      jest
        .spyOn(prisma.passenger, 'create')
        .mockResolvedValue(passengerWithoutPassword as any);

      const result = await service.create(createPassengerDto);

      expect(hasherAdapter.hash).toHaveBeenCalledWith(
        createPassengerDto.password,
      );
      expect(prisma.passenger.create).toHaveBeenCalledWith({
        data: { ...createPassengerDto, password: hashedPassword },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
        },
      });
      expect(result).toEqual(passengerWithoutPassword);
    });
  });

  describe('findOneByEmail', () => {
    it('deve retornar um passageiro pelo email', async () => {
      jest
        .spyOn(prisma.passenger, 'findFirstOrThrow')
        .mockResolvedValue(passenger);

      const result = await service.findOneByEmail(passenger.email);

      expect(prisma.passenger.findFirstOrThrow).toHaveBeenCalledWith({
        where: { email: passenger.email },
      });
      expect(result).toEqual(passenger);
    });

    it('deve lançar uma exceção se o passageiro não for encontrado', async () => {
      jest
        .spyOn(prisma.passenger, 'findFirstOrThrow')
        .mockRejectedValue(new Error('Not Found'));

      await expect(
        service.findOneByEmail('nonexistent@example.com'),
      ).rejects.toThrow();
    });
  });

  describe('findOne', () => {
    it('deve retornar um passageiro pelo ID', async () => {
      jest
        .spyOn(prisma.passenger, 'findFirstOrThrow')
        .mockResolvedValue(passenger);

      const result = await service.findOne(passenger.id);

      expect(prisma.passenger.findFirstOrThrow).toHaveBeenCalledWith({
        where: { id: passenger.id },
      });
      expect(result).toEqual(passenger);
    });

    it('deve lançar uma exceção se o passageiro não for encontrado', async () => {
      jest
        .spyOn(prisma.passenger, 'findFirstOrThrow')
        .mockRejectedValue(new Error('Not Found'));

      await expect(service.findOne(999)).rejects.toThrow();
    });
  });

  describe('update', () => {
    const updatePassengerDto: UpdatePassengerDto = {
      name: 'Jane Smith',
    };

    it('deve atualizar um passageiro com dados válidos', async () => {
      jest
        .spyOn(prisma.passenger, 'update')
        .mockResolvedValue(updatedPassenger);

      const result = await service.update(passenger.id, updatePassengerDto);

      expect(prisma.passenger.update).toHaveBeenCalledWith({
        where: { id: passenger.id },
        data: updatePassengerDto,
      });
      expect(result).toEqual(updatedPassenger);
    });

    it('deve lançar uma exceção se o passageiro não for encontrado para atualização', async () => {
      jest
        .spyOn(prisma.passenger, 'update')
        .mockRejectedValue(new Error('Not Found'));

      await expect(service.update(999, updatePassengerDto)).rejects.toThrow();
    });
  });

  describe('delete', () => {
    it('deve deletar um passageiro pelo ID', async () => {
      jest.spyOn(prisma.passenger, 'delete').mockResolvedValue(passenger);

      await service.delete(passenger.id);

      expect(prisma.passenger.delete).toHaveBeenCalledWith({
        where: { id: passenger.id },
      });
    });

    it('deve lançar uma exceção se o passageiro não for encontrado para deleção', async () => {
      jest
        .spyOn(prisma.passenger, 'delete')
        .mockRejectedValue(new Error('Not Found'));

      await expect(service.delete(999)).rejects.toThrow();
    });
  });
});
