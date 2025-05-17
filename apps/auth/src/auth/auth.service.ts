import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model, Types } from 'mongoose';
import { UserService } from '../user/user.service';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserSession } from './schema/user-session.schema';

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

    await this.userSessionModel.create({
      userId: user._id,
      refreshToken,
    });

    return { accessToken, refreshToken };
  }

  async issueAccessToken(userId: Types.ObjectId) {
    const payload: JwtPayloadDto = {
      userId,
    };

    return await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    });
  }

  async issueRefreshToken() {
    return await this.jwtService.signAsync({
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    });
  }
}
