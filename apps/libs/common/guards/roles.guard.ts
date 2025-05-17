import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

export enum UserRoles {
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR',
  AUDITOR = 'AUDITOR',
  USER = 'USER',
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.get<UserRoles[]>(
      'roles',
      context.getHandler(),
    );

    console.log(requiredRoles);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log(user);
    if (!user) {
      throw new ForbiddenException('인증이 필요합니다.');
    }

    if (!user.userType) {
      throw new ForbiddenException('권한이 없습니다.');
    }

    const hasRole = requiredRoles.includes(user.userType);
    if (!hasRole) {
      throw new ForbiddenException('해당 API에 접근할 권한이 없습니다.');
    }

    return true;
  }
}
