import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model, Types } from 'mongoose';
import { UserSession } from '../user/schema/user-session.schema';
import { UserService } from '../user/user.service';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,

    @InjectModel(UserSession.name)
    private readonly userSessionModel: Model<UserSession>,
  ) {}

  // 회원가입
  async register(registerDto: RegisterDto) {
    const { email, password, name } = registerDto;

    const existUser = await this.userService.findOneByEmail(email);

    if (existUser) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }

    // password 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 생성
    const user = await this.userService.create({
      email,
      password: hashedPassword,
      name,
    });

    return user;
  }

  // 로그인
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userService.findOneByEmail(email);

    // 비밀번호 대조
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!user || !isPasswordValid) {
      throw new UnauthorizedException('이메일 또는 비밀번호 오류입니다.');
    }

    // 액세스 토큰 발급
    const accessToken = await this.issueAccessToken(user._id);
    const refreshToken = await this.issueRefreshToken();

    // 리프레시 토큰 업데이트
    await this.userSessionModel.findOneAndUpdate(
      { userId: user._id },
      {
        refreshToken,
        expiresAt: new Date(this.jwtService.decode(refreshToken).exp * 1000),
      },
      { upsert: true },
    );

    return { accessToken, refreshToken };
  }

  // 액세스 토큰 발급
  async issueAccessToken(userId: Types.ObjectId) {
    const payload: JwtPayloadDto = {
      userId,
      tokenType: 'access',
    };

    return await this.jwtService.signAsync(payload, {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    });
  }

  // 리프레시 토큰 발급
  async issueRefreshToken() {
    const payload: JwtPayloadDto = {
      userId: new Types.ObjectId(),
      tokenType: 'refresh',
    };

    return await this.jwtService.signAsync(payload, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    });
  }

  // 리프레시 토큰 유효성 확인 & 토큰 재발급
  async refresh(refreshTokenDto: RefreshTokenDto) {
    let { refreshToken } = refreshTokenDto;

    // 리프레시 토큰 유효성 확인
    try {
      await this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET,
      });
    } catch (error) {
      if (error.message === 'jwt expired') {
        await this.userSessionModel.deleteOne({ refreshToken });
        throw new UnauthorizedException('리프레시 토큰이 만료되었습니다.');
      }

      throw new UnauthorizedException('유효하지 않은 리프레시 토큰입니다.');
    }

    const userSession = await this.userSessionModel.findOne({ refreshToken });

    if (!userSession) {
      throw new UnauthorizedException('유효하지 않은 리프레시 토큰입니다.');
    }

    const accessToken = await this.issueAccessToken(userSession.userId);

    // 만료 임박 시 리프레시 토큰 재발급
    if (userSession.expiresAt < new Date(Date.now() + 1000 * 60 * 24)) {
      const newRefreshToken = await this.issueRefreshToken();
      const newAccessToken = await this.issueAccessToken(userSession.userId);

      await this.userSessionModel.findOneAndUpdate(
        { userId: userSession.userId },
        { refreshToken: newRefreshToken, lastUsedAt: new Date() },
      );

      return { accessToken: newAccessToken, refreshToken };
    }

    await this.userSessionModel.findOneAndUpdate(
      { userId: userSession.userId },
      { refreshToken, lastUsedAt: new Date() },
      { upsert: true },
    );

    return { accessToken, refreshToken };
  }
}
