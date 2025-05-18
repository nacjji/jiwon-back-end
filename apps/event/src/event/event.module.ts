import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from 'apps/event/src/event/schema/event.schema';
import { JwtStrategy } from 'apps/libs/common/strategy/jwt.strategy';
import { RewardModule } from '../reward/reward.module';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { UserEvent, UserEventSchema } from './schema/user-event.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
    MongooseModule.forFeature([
      { name: UserEvent.name, schema: UserEventSchema },
    ]),
    RewardModule,
  ],
  controllers: [EventController],
  providers: [EventService, JwtStrategy],
})
export class EventModule {}
