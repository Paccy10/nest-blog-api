import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { UsersService } from './../../modules/users/users.service';

@Injectable()
export class DoesUserExist implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  canActivate(
    content: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = content.switchToHttp().getRequest();
    return this.validateRequest(request);
  }
  async validateRequest(request) {
    const userExist = await this.usersService.findOneByEmail(
      request.body.email,
    );
    if (userExist) {
      throw new ForbiddenException('This email already exist');
    }
    return true;
  }
}
