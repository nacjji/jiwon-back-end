import {
  ExecutionContext,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: HttpException, user: any, info: Error) {
    try {
      if (err || info || !user) {
        throw err || info || new UnauthorizedException();
      }
      if (user.tokenType !== 'access') {
        throw new UnauthorizedException('INVALID_TOKEN');
      }

      console.log({ authGuard: user });

      return user;
    } catch (error) {
      // 토큰 만료 시 498 에러 발생
      if (error.message === 'jwt expired') {
        throw new HttpException('TOKEN_EXPIRED', 498, {
          cause: new Error('TOKEN_EXPIRED'),
        });
      } else {
        throw new UnauthorizedException(error.message);
      }
    }
  }
}
