import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';
import { EventModule } from './event/event.module';
import { RewardModule } from './reward/reward.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['./apps/event/.env'],
      validationSchema: Joi.object({
        DB_URL: Joi.string().required(),
      }),
    }),
    MongooseModule.forRoot(process.env.DB_URL),
    EventModule,
    RewardModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
