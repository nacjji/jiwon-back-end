import { Body, Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ManagerRegisterDto } from './dto/manager-register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('유저관리')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'hello_auth' })
  helloAuth() {
    return 'hello auth';
  }

  @MessagePattern({ cmd: 'user_register' })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.userRegister(registerDto);
  }

  @MessagePattern({ cmd: 'manager_register' })
  registerManager(@Body() registerDto: ManagerRegisterDto) {
    return this.authService.managerRegister(registerDto);
  }

  @MessagePattern({ cmd: 'user_login' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto, 'user');
  }

  @MessagePattern({ cmd: 'manager_login' })
  async managerLogin(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto, 'manager');
  }

  @MessagePattern({ cmd: 'refresh' })
  async refresh(@Body() refreshDto: RefreshTokenDto) {
    return this.authService.refresh(refreshDto);
  }
}
