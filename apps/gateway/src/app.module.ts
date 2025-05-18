import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtStrategy } from 'apps/libs/common/strategy/jwt.strategy';
import * as Joi from 'joi';
import { AuthController } from './auth.controller';
import { EventController } from './event.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['./apps/gateway/.env'],
      validationSchema: Joi.object({
        TCP_PORT: Joi.number().required(),
      }),
    }),
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'auth',
          port: +process.env.TCP_PORT,
        },
      },
      {
        name: 'EVENT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'event',
          port: +process.env.TCP_PORT,
        },
      },
    ]),
  ],
  controllers: [AuthController, EventController],
  providers: [JwtStrategy],
})
export class AppModule {}
