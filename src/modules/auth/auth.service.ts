import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private async comparePasswords(enteredPassword, dbpassword) {
    const match = await bcrypt.compare(enteredPassword, dbpassword);
    return match;
  }

  private async hashPassword(password) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  private async generateToken(user) {
    const token = await this.jwtService.signAsync(user);
    return token;
  }

  async login(user) {
    const token = await this.generateToken(user);
    return { user, token };
  }

  async create(user) {
    const hash = await this.hashPassword(user.password);
    const newUser = await this.usersService.create({ ...user, password: hash });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = newUser['dataValues'];
    const token = await this.generateToken(result);
    return { user: result, token };
  }

  async validateUser(username: string, pass: string) {
    const user = await this.usersService.findOneByEmail(username);
    if (!user) {
      return null;
    }

    const match = await this.comparePasswords(pass, user.password);
    if (!match) {
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user['dataValues'];
    return result;
  }
}
