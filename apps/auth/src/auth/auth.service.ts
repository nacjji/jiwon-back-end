import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model, Types } from 'mongoose';
import { ManagerService } from '../manager/manager.service';
import { UserSession } from '../user/schema/user-session.schema';
import { UserService } from '../user/user.service';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { LoginDto } from './dto/login.dto';
import { ManagerRegisterDto } from './dto/manager-register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly managerService: ManagerService,
    private readonly jwtService: JwtService,

    @InjectModel(UserSession.name)
    private readonly userSessionModel: Model<UserSession>,
  ) {}

  private async hashPassword(password: string) {
    return await bcrypt.hash(password, +process.env.HASH_ROUND);
  }

  // 회원가입
  async userRegister(registerDto: RegisterDto) {
    const { email, password, name } = registerDto;

    const existUser = await this.userService.findOneByEmail(email);

    if (existUser) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }

    // password 암호화
    const hashedPassword = await this.hashPassword(password);

    // 생성
    const user = await this.userService.create({
      email,
      password: hashedPassword,
      name,
    });

    // 액세스 토큰 발급
    const accessToken = await this.issueAccessToken(user._id, 'USER');
    const refreshToken = await this.issueRefreshToken(user._id, 'USER');

    return { accessToken, refreshToken };
  }

  // 관리자 회원가입
  async managerRegister(registerDto: ManagerRegisterDto) {
    const existUser = await this.managerService.findOne({
      email: registerDto.email,
      userType: registerDto.userType,
    });

    if (existUser) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }

    const manager = await this.managerService.create({
      email: registerDto.email,
      password: await this.hashPassword(registerDto.password),
      name: registerDto.name,
      userType: registerDto.userType,
    });

    const accessToken = await this.issueAccessToken(
      manager._id,
      manager.userType,
    );
    const refreshToken = await this.issueRefreshToken(
      manager._id,
      manager.userType,
    );

    return { accessToken, refreshToken };
  }

  async login(loginDto: LoginDto, loginBy: 'user' | 'manager') {
    const { email, password, userType } = loginDto;
    let user = null;

    if (loginBy === 'user') {
      user = await this.userService.findOneByEmail(email);
    } else if (loginBy === 'manager') {
      user = await this.managerService.findOne({ email, userType });
    }
    if (!user) {
      throw new UnauthorizedException('이메일 또는 비밀번호 오류입니다.');
    }

    const isPasswordValid = await this.comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('이메일 또는 비밀번호 오류입니다.');
    }

    const accessToken = await this.issueAccessToken(user._id, userType);
    const refreshToken = await this.issueRefreshToken(user._id, userType);

    return { accessToken, refreshToken };
  }

  // 액세스 토큰 발급
  private async issueAccessToken(
    userId: Types.ObjectId,
    userType: 'USER' | 'OPERATOR' | 'AUDITOR' | 'ADMIN',
  ) {
    const payload: JwtPayloadDto = {
      userId,
      userType,
      tokenType: 'access',
    };

    return await this.jwtService.signAsync(payload, {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    });
  }

  // 리프레시 토큰 발급
  private async issueRefreshToken(
    userId: Types.ObjectId,
    userType: 'USER' | 'OPERATOR' | 'AUDITOR' | 'ADMIN',
  ) {
    const payload: JwtPayloadDto = {
      userId,
      tokenType: 'refresh',
      userType,
    };

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    });
    const expiresAt = this.jwtService.decode(refreshToken).exp;

    await this.userSessionModel.findOneAndUpdate(
      {
        userId,
        userType,
      },
      {
        refreshToken,
        lastUsedAt: new Date(),
        userType,
        expiresAt: new Date(expiresAt * 1000),
      },
      { upsert: true },
    );

    return await this.jwtService.signAsync(payload, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    });
  }

  // 리프레시 토큰 유효성 확인 & 토큰 재발급
  async refresh(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;

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

    // 리프레시 토큰 조회
    const userSession = await this.userSessionModel.findOne({ refreshToken });

    const user = await this.userService.findOneById(userSession.userId);

    console.log(user);

    if (!userSession) {
      throw new UnauthorizedException('유효하지 않은 리프레시 토큰입니다.');
    }

    // 새 액세스 토큰 발급
    const accessToken = await this.issueAccessToken(
      userSession.userId,
      userSession.userType,
    );

    // 만료 임박 시 리프레시 토큰 재발급
    if (userSession.expiresAt < new Date(Date.now() + 1000 * 60 * 24)) {
      const newRefreshToken = await this.issueRefreshToken(
        userSession.userId,
        userSession.userType,
      );

      await this.userSessionModel.findOneAndUpdate(
        { userId: userSession.userId },
        { refreshToken: newRefreshToken, lastUsedAt: new Date() },
      );

      return { accessToken, refreshToken: newRefreshToken };
    }

    await this.userSessionModel.findOneAndUpdate(
      { userId: userSession.userId },
      { refreshToken, lastUsedAt: new Date() },
      { upsert: true },
    );

    return { accessToken, refreshToken };
  }

  private async comparePassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }
}
