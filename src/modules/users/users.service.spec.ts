import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { HasherAdapter } from '../../adapters/hasher/hasher.adapter';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

describe('UsersService', () => {
  let usersService: UsersService;
  let prisma: PrismaService;
  let hasherAdapter: HasherAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
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
            compare: jest.fn(),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
    hasherAdapter = module.get<HasherAdapter>(HasherAdapter);
  });

  it('should create a user successfully', async () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    };
    const hashedPassword = 'hashedPassword';
    const userResponse: UserResponseDto = {
      id: 1,
      email: createUserDto.email,
      name: createUserDto.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(hasherAdapter, 'hash').mockResolvedValue(hashedPassword);
    jest.spyOn(prisma.user, 'create').mockResolvedValue(userResponse as any);

    const result = await usersService.create(createUserDto);

    expect(result).toEqual(userResponse);
    expect(hasherAdapter.hash).toHaveBeenCalledWith(createUserDto.password);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: { ...createUserDto, password: hashedPassword },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  });

  it('should find a user by ID', async () => {
    const userId = 1;
    const userResponse: UserResponseDto = {
      id: userId,
      email: 'test@example.com',
      name: 'Test User',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest
      .spyOn(prisma.user, 'findFirstOrThrow')
      .mockResolvedValue(userResponse as any);

    const result = await usersService.findOne(userId);

    expect(result).toEqual(userResponse);
    expect(prisma.user.findFirstOrThrow).toHaveBeenCalledWith({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  });

  it('should throw an error if user is not found by ID', async () => {
    const userId = 1;
    jest.spyOn(prisma.user, 'findFirstOrThrow').mockRejectedValue(
      new PrismaClientKnownRequestError('User not found', {
        code: 'P2025',
        clientVersion: '4.0.0',
      }),
    );

    await expect(usersService.findOne(userId)).rejects.toThrow(
      PrismaClientKnownRequestError,
    );
    expect(prisma.user.findFirstOrThrow).toHaveBeenCalledWith({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  });

  it('should update a user successfully', async () => {
    const userId = 1;
    const updateUserDto: UpdateUserDto = { name: 'Updated User' };
    const updatedUserResponse: UserResponseDto = {
      id: userId,
      email: 'test@example.com',
      name: updateUserDto.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest
      .spyOn(prisma.user, 'update')
      .mockResolvedValue(updatedUserResponse as any);

    const result = await usersService.update(userId, updateUserDto);

    expect(result).toEqual(updatedUserResponse);
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: userId },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  });

  it('should remove a user successfully', async () => {
    const userId = 1;

    jest.spyOn(prisma.user, 'delete').mockResolvedValue({ id: userId } as User);

    const result = await usersService.remove(userId);

    expect(result).toEqual({ id: userId });
    expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: userId } });
  });
});
