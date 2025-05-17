import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Manager } from '../user/schema/manager.schema';
import { CreateManagerDto } from './dto/create-manager.dto';

@Injectable()
export class ManagerService {
  constructor(
    @InjectModel(Manager.name)
    private readonly managerModel: Model<Manager>,
  ) {}

  async create(createDto: CreateManagerDto) {
    const manager = await this.managerModel.create(createDto);
    return manager;
  }

  async findOne(filter: {
    email?: string;
    userType?: 'USER' | 'OPERATOR' | 'AUDITOR' | 'ADMIN';
  }) {
    return this.managerModel.findOne(filter);
  }
}
