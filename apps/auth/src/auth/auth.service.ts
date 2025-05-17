import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
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

    // 토큰 발행
    const payload = {
      id: user._id,
    };

    const accessToken = this.jwtService.sign(payload);

    return { accessToken, refreshToken };
  }
}
