import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(registerDto: RegisterDto) {
    const { email, password, name } = registerDto;

    const existUser = await this.userService.findOneByEmail(email);

    if (existUser) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }

    // password 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userService.create({
      email,
      password: hashedPassword,
      name,
    });

    return user;
  }
}
