import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from 'apps/auth/src/auth/dto/login.dto';
import { ManagerRegisterDto } from 'apps/auth/src/auth/dto/manager-register.dto';
import { RefreshTokenDto } from 'apps/auth/src/auth/dto/refresh-token.dto';
import { RegisterDto } from 'apps/auth/src/auth/dto/register.dto';

@ApiTags('인증/인가')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE')
    private readonly authClient: ClientProxy,
  ) {}

  @ApiOperation({
    summary: '유저 회원가입',
    description: '유저 회원가입을 진행합니다.',
  })
  @Post('user/register')
  register(@Body() registerDto: RegisterDto) {
    return this.authClient.send({ cmd: 'user_register' }, registerDto);
  }

  @ApiOperation({
    summary: '운영자/관리자 회원가입',
    description: '운영자/관리자 회원가입을 진행합니다.',
  })
  @Post('manager/register')
  registerManager(@Body() registerDto: ManagerRegisterDto) {
    return this.authClient.send({ cmd: 'manager_register' }, registerDto);
  }

  @ApiOperation({
    summary: '유저 로그인',
    description: '유저 로그인을 진행합니다.',
  })
  @Post('user/login')
  async login(@Body() loginDto: LoginDto) {
    return this.authClient.send({ cmd: 'user_login' }, loginDto);
  }

  @ApiOperation({
    summary: '운영자/관리자 로그인',
    description: '운영자/관리자 로그인을 진행합니다.',
  })
  @Post('manager/login')
  async managerLogin(@Body() loginDto: LoginDto) {
    return this.authClient.send({ cmd: 'manager_login' }, loginDto);
  }

  @ApiOperation({
    summary: '리프레시 토큰 발급',
    description: '리프레시 토큰을 발급합니다.',
  })
  @Post('refresh')
  async refresh(@Body() refreshDto: RefreshTokenDto) {
    return this.authClient.send({ cmd: 'refresh' }, refreshDto);
  }
}
