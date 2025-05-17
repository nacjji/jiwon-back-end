import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Manager, ManagerSchema } from './schema/manager.schema';
import { User, UserSchema } from './schema/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Manager.name, schema: ManagerSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
