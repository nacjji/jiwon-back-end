import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from '../../../libs/common/strategy/jwt.strategy';
import { ManagerModule } from '../manager/manager.module';
import {
  UserSession,
  UserSessionSchema,
} from '../user/schema/user-session.schema';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UserModule,
    ManagerModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    MongooseModule.forFeature([
      { name: UserSession.name, schema: UserSessionSchema },
    ]),
  ],
  exports: [AuthService],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
