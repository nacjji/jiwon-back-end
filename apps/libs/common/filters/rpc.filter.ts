import { ArgumentsHost, Catch, RpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';
import { throwError } from 'rxjs';
@Catch(RpcException)
export class rpcFilter implements RpcExceptionFilter<RpcException> {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(400).json({
      statusCode: 400,
      message: exception.getError(),
    });

    response.status(500).json({
      statusCode: 500,
      message: 'RPC 예외 발생',
    });

    return throwError(() => `RPC 예외 발생: ${exception}`);
  }
}
