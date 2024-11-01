import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signIn: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should return access token when signIn is successful', async () => {
    const signInDto: SignInDto = {
      email: 'test@example.com',
      password: 'password123',
    };
    const accessToken = { access_token: 'mockAccessToken' };

    jest.spyOn(authService, 'signIn').mockResolvedValue(accessToken);

    const result = await authController.signIn(signInDto);

    expect(result).toEqual(accessToken);
    expect(authService.signIn).toHaveBeenCalledWith(
      signInDto.email,
      signInDto.password,
    );
  });

  it('should throw UnauthorizedException when credentials are invalid', async () => {
    const signInDto: SignInDto = {
      email: 'test@example.com',
      password: 'wrongpassword',
    };

    jest
      .spyOn(authService, 'signIn')
      .mockRejectedValue(new UnauthorizedException());

    await expect(authController.signIn(signInDto)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(authService.signIn).toHaveBeenCalledWith(
      signInDto.email,
      signInDto.password,
    );
  });
});
