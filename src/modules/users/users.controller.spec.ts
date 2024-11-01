import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { Request } from 'express';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';
import { JwtService } from '@nestjs/jwt';

describe('UsersController', () => {
  let usersController: UsersController;

  const mockUsersService = {
    create: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        AuthGuard,
        {
          provide: JwtService,
          useValue: JwtService,
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John',
        email: 'john@example.com',
        password: 'securePassword',
      };
      const expectedResult: UserResponseDto = {
        id: 1,
        name: 'John',
        email: 'john@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.create.mockResolvedValue(expectedResult);

      expect(await usersController.create(createUserDto)).toEqual(
        expectedResult,
      );
      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findOneOrFail', () => {
    it('should return a user by id', async () => {
      const userId = 1;
      const expectedResult: UserResponseDto = {
        id: userId,
        name: 'John',
        email: 'john@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.findOne.mockResolvedValue(expectedResult);

      expect(await usersController.findOneOrFail(userId)).toEqual(
        expectedResult,
      );
      expect(mockUsersService.findOne).toHaveBeenCalledWith(userId);
    });
  });

  describe('update', () => {
    it('should update the authenticated user', async () => {
      const req = { user: { sub: 1 } } as unknown as Request;
      const updateUserDto: UpdateUserDto = { name: 'John Updated' };
      const expectedResult: UserResponseDto = {
        id: 1,
        name: 'John Updated',
        email: 'john@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.update.mockResolvedValue(expectedResult);

      expect(await usersController.update(req, updateUserDto)).toEqual(
        expectedResult,
      );
      expect(mockUsersService.update).toHaveBeenCalledWith(1, updateUserDto);
    });
  });

  describe('remove', () => {
    it('should remove the authenticated user', async () => {
      const req = { user: { sub: 1 } } as unknown as Request;

      mockUsersService.remove.mockResolvedValue(undefined);

      await usersController.remove(req);
      expect(mockUsersService.remove).toHaveBeenCalledWith(1);
    });
  });
});
