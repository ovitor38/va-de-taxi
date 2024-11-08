import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiTags('auth')
  signIn(@Body() signInDto: SignInDto, @Headers('isDriver') isDriver: boolean) {
    return this.authService.signIn(
      signInDto.email,
      signInDto.password,
      isDriver,
    );
  }
}
