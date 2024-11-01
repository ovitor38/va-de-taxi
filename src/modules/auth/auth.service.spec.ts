import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { HasherAdapter } from '../../adapters/hasher/hasher.adapter';
import { UnauthorizedException } from '@nestjs/common';
import { messagesErrorHelper } from '../../helpers/messages.helper';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let hasherAdapter: HasherAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOneByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
        {
          provide: HasherAdapter,
          useValue: {
            compare: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    hasherAdapter = module.get<HasherAdapter>(HasherAdapter);
  });

  it('should return access_token if signIn is successful', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const user = {
      id: 1,
      email,
      password: 'hashed_password',
      name: 'james',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const accessToken = 'mockAccessToken';

    jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(user);
    jest.spyOn(hasherAdapter, 'compare').mockResolvedValue(true);
    jest.spyOn(jwtService, 'signAsync').mockResolvedValue(accessToken);

    const result = await authService.signIn(email, password);

    expect(result).toEqual({ access_token: accessToken });
    expect(usersService.findOneByEmail).toHaveBeenCalledWith(email);
    expect(hasherAdapter.compare).toHaveBeenCalledWith(password, user.password);
    expect(jwtService.signAsync).toHaveBeenCalledWith({
      sub: user.id,
      email: user.email,
    });
  });

  it('should throw UnauthorizedException if password is incorrect', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const user = {
      id: 1,
      email,
      password: 'hashed_password',
      name: 'james',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(user);
    jest.spyOn(hasherAdapter, 'compare').mockResolvedValue(false);

    await expect(authService.signIn(email, password)).rejects.toThrow(
      new UnauthorizedException({
        message: messagesErrorHelper.PASSWORD_OR_EMAIL_INVALID,
      }),
    );

    expect(usersService.findOneByEmail).toHaveBeenCalledWith(email);
    expect(hasherAdapter.compare).toHaveBeenCalledWith(password, user.password);
    expect(jwtService.signAsync).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedException if user is not found', async () => {
    const email = 'test@example.com';
    const password = 'password123';

    jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(null);

    await expect(authService.signIn(email, password)).rejects.toThrow(
      new UnauthorizedException({
        message: messagesErrorHelper.PASSWORD_OR_EMAIL_INVALID,
      }),
    );

    expect(usersService.findOneByEmail).toHaveBeenCalledWith(email);
    expect(hasherAdapter.compare).not.toHaveBeenCalled();
    expect(jwtService.signAsync).not.toHaveBeenCalled();
  });
});
