import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterDto } from '../auth/dto/register.dto';
import { User } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async create(userDto: RegisterDto) {
    const user = await this.userModel.create(userDto);
    return user;
  }

  async findOneByEmail(email: string) {
    return this.userModel.findOne({ email });
  }
}
