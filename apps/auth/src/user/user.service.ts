import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async create(userDto: CreateUserDto) {
    const user = await this.userModel.create(userDto);
    return user;
  }

  async findOneByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async findOneById(id: Types.ObjectId) {
    return this.userModel.findById(id).select('-password');
  }
}
