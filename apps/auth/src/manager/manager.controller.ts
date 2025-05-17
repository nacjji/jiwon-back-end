import { Controller } from '@nestjs/common';
import { ManagerService } from './manager.service';

@Controller()
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}
}
