import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from 'apps/event/src/event/schema/event.schema';
import { RewardModule } from '../reward/reward.module';
import { EventController } from './event.controller';
import { EventService } from './event.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
    RewardModule,
  ],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
