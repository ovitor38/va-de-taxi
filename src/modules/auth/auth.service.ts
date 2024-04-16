import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { HasherAdapter } from 'src/adapters/hasher/hasher.adapter';
import { messagesErrorHelper } from 'src/helpers/messages.helper';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private hasherAdapter: HasherAdapter,
  ) {}

  async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findOneByEmail(email);

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
