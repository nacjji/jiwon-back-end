import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
    ClientsModule.registerAsync({
      clients: [
        {
          name: 'AUTH_SERVICE',
          useFactory: (configService: ConfigService) => ({
            transport: Transport.TCP,
            options: {
              host: configService.getOrThrow('AUTH_SERVICE_HOST'),
              port: configService.getOrThrow('AUTH_SERVICE_PORT'),
            },
          }),
          inject: [ConfigService],
        },
        {
          name: 'EVENT_SERVICE',
          useFactory: (configService: ConfigService) => ({
            transport: Transport.TCP,
            options: {
              host: configService.getOrThrow('EVENT_SERVICE_HOST'),
              port: configService.getOrThrow('EVENT_SERVICE_PORT'),
            },
          }),
          inject: [ConfigService],
        },
      ],
    }),
  ],
  controllers: [AuthController, EventController],
  providers: [JwtStrategy],
})
export class AppModule {}
