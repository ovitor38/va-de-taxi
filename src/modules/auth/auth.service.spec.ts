import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { DriverService } from '../driver/driver.service';
import { PassengerService } from '../passenger/passenger.service';
import { HasherAdapter } from '../../adapters/hasher/hasher.adapter';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let driverService: DriverService;
  let passengerService: PassengerService;
  let hasherAdapter: HasherAdapter;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: DriverService, useValue: { findOneByEmail: jest.fn() } },
        { provide: PassengerService, useValue: { findOneByEmail: jest.fn() } },
        { provide: JwtService, useValue: { signAsync: jest.fn() } },
        { provide: HasherAdapter, useValue: { compare: jest.fn() } },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    driverService = module.get<DriverService>(DriverService);
    passengerService = module.get<PassengerService>(PassengerService);
    jwtService = module.get<JwtService>(JwtService);
    hasherAdapter = module.get<HasherAdapter>(HasherAdapter);
  });

  it('should successfully sign in a driver and return a JWT', async () => {
    const user = {
      id: 1,
      email: 'driver@example.com',
      password: 'hashedpassword',
    } as any;
    jest.spyOn(driverService, 'findOneByEmail').mockResolvedValue(user);
    jest.spyOn(hasherAdapter, 'compare').mockResolvedValue(true);
    jest.spyOn(jwtService, 'signAsync').mockResolvedValue('jwt.token');

    const result = await authService.signIn(
      'driver@example.com',
      'password',
      true,
    );
    expect(result.access_token).toBe('jwt.token');
  });

  it('should successfully sign in a passenger and return a JWT', async () => {
    const user = {
      id: 1,
      email: 'passenger@example.com',
      password: 'hashedpassword',
    } as any;
    jest.spyOn(passengerService, 'findOneByEmail').mockResolvedValue(user);
    jest.spyOn(hasherAdapter, 'compare').mockResolvedValue(true);
    jest.spyOn(jwtService, 'signAsync').mockResolvedValue('jwt.token');

    const result = await authService.signIn(
      'passenger@example.com',
      'password',
      false,
    );
    expect(result.access_token).toBe('jwt.token');
  });

  it('should throw UnauthorizedException if email is not found', async () => {
    jest.spyOn(driverService, 'findOneByEmail').mockResolvedValue(null);
    await expect(
      authService.signIn('unknown@example.com', 'password', true),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if password is incorrect', async () => {
    const user = {
      id: 1,
      email: 'driver@example.com',
      password: 'hashedpassword',
    } as any;
    jest.spyOn(driverService, 'findOneByEmail').mockResolvedValue(user);
    jest.spyOn(hasherAdapter, 'compare').mockResolvedValue(false);

    await expect(
      authService.signIn('driver@example.com', 'wrongpassword', true),
    ).rejects.toThrow(UnauthorizedException);
  });
});
