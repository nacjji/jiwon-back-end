import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request.headers.authorization?.split('Bearer ')[1];
        },
      ]),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayloadDto) {
    // 검증에 성공하면 payload를 반환하고, 이것이 request.user에 할당됩니다.
    const user: JwtPayloadDto = {
      userId: payload.userId,
      tokenType: payload.tokenType,
    };

    console.log({ strategy: user });

    return user;
  }
}
