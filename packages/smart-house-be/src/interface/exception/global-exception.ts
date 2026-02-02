import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { isProd } from '@/shared/toolkits/env';
import { createLogger, LokiLogger } from '@/shared/logger';

@Catch()
export class GlobalExceptionsFilter implements ExceptionFilter {
  private logger: LokiLogger;

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: (exception as any)?.message ?? 'Internal Server Error' };

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      error: message instanceof Object ? (message as any).message || message : message, // 提取错误详细信息
      stack: isProd ? undefined : (exception as any).stack,
    };

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger = this.logger || createLogger('global-exception');
      this.logger.error(exception);
    }

    response.status(status).json(errorResponse);
  }
}
