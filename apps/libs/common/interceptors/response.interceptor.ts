import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import { Observable, map } from 'rxjs';

export interface CustomResponse<T> {
  data: T;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, CustomResponse<T>>
{
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<CustomResponse<T>> {
    const responseMessage = this.reflector.getAllAndOverride<string[]>(
      'ResponseMessage',
      [context.getHandler(), context.getClass()],
    );

    return next.handle().pipe(
      map((data) => {
        const http = context.switchToHttp();
        const response = http.getResponse<Response>();

        return {
          statusCode: response.statusCode,
          message: responseMessage ?? null,
          data: data ?? null,
        };
      }),
    );
  }
}
