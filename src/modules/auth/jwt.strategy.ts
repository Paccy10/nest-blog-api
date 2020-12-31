import { Strategy, ExtractJwt } from 'passport-jwt';
import { UsersService } from './../users/users.service';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWTKEY,
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findOneById(payload.id);
    if (!user) {
      throw new UnauthorizedException(
        'You are not authorized to perform the operation',
      );
    }
    return payload;
  }
}
