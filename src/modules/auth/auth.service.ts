import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { HasherAdapter } from '../../adapters/hasher/hasher.adapter';
import { messagesErrorHelper } from '../../helpers/messages.helper';
import { DriverService } from '../driver/driver.service';
import { PassengerService } from '../passenger/passenger.service';
import { Driver, Passenger } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private driverService: DriverService,
    private passengerService: PassengerService,
    private jwtService: JwtService,
    private hasherAdapter: HasherAdapter,
  ) {}

  async signIn(
    email: string,
    password: string,
    isDriver: boolean,
  ): Promise<{ access_token: string }> {
    let user: Passenger | Driver;

    if (isDriver) {
      user = await this.driverService.findOneByEmail(email);
    } else {
      user = await this.passengerService.findOneByEmail(email);
    }

    if (!user) {
      throw new UnauthorizedException({
        message: messagesErrorHelper.PASSWORD_OR_EMAIL_INVALID,
      });
    }

    const samePassword = await this.hasherAdapter.compare(
      password,
      user.password,
    );

    if (!samePassword) {
      throw new UnauthorizedException({
        message: messagesErrorHelper.PASSWORD_OR_EMAIL_INVALID,
      });
    }

    const payload = { sub: user.id, email: user.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
