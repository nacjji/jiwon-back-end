import { SetMetadata } from '@nestjs/common';
import { UserRoles } from '../guards/roles.guard';

export const Roles = (...roles: UserRoles[]) => SetMetadata('roles', roles);
