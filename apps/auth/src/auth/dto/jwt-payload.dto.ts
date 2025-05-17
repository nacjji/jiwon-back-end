import { Types } from 'mongoose';

export class JwtPayloadDto {
  userId: Types.ObjectId;
  tokenType: 'access' | 'refresh';
}
