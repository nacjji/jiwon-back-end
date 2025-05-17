import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Manager, ManagerSchema } from '../user/schema/manager.schema';
import { ManagerController } from './manager.controller';
import { ManagerService } from './manager.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Manager.name, schema: ManagerSchema }]),
  ],
  controllers: [ManagerController],
  providers: [ManagerService],
  exports: [ManagerService],
})
export class ManagerModule {}
