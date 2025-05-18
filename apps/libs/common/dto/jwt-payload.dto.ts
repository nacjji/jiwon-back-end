import { Types } from 'mongoose';

export class JwtPayloadDto {
  userId: Types.ObjectId;
  tokenType: 'access' | 'refresh';
  userType?: 'USER' | 'OPERATOR' | 'AUDITOR' | 'ADMIN';
}
