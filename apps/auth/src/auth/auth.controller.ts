import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ManagerRegisterDto } from './dto/manager-register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('유저관리')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '유저 회원가입',
    description: '유저 회원가입을 진행합니다.',
  })
  @Post('user/register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.userRegister(registerDto);
  }

  @ApiOperation({
    summary: '운영자/관리자 회원가입',
    description: '운영자/관리자 회원가입을 진행합니다.',
  })
  @Post('manager/register')
  registerManager(@Body() registerDto: ManagerRegisterDto) {
    return this.authService.managerRegister(registerDto);
  }

  @ApiOperation({
    summary: '유저 로그인',
    description: '유저 로그인을 진행합니다.',
  })
  @Post('user/login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto, 'user');
  }

  @ApiOperation({
    summary: '운영자/관리자 로그인',
    description: '운영자/관리자 로그인을 진행합니다.',
  })
  @Post('manager/login')
  async managerLogin(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto, 'manager');
  }

  @ApiOperation({
    summary: '리프레시 토큰 발급',
    description: '리프레시 토큰을 발급합니다.',
  })
  @Post('refresh')
  async refresh(@Body() refreshDto: RefreshTokenDto) {
    return this.authService.refresh(refreshDto);
  }
}
