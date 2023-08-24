/** 处理指定错误，修改默认的提示 */
import { Catch, ArgumentsHost, Logger, HttpStatus, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { QueryFailedError } from 'typeorm';

@Catch()
export class ExceptionsCatchFilter extends BaseExceptionFilter {
  private static readonly subLogger = new Logger(ExceptionsCatchFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const name = exception?.constructor?.name;
    switch (true) {
      case name === 'QueryFailedError':
        this.handlerQueryFailedError(exception as QueryFailedError, host);
        break;
      case exception instanceof HttpException:
        super.catch(exception, host);
        break;
      default:
        ExceptionsCatchFilter.subLogger.error(`unknown error: ${name}`);
        super.catch(exception, host);
    }
  }

  private handlerQueryFailedError(exception: QueryFailedError, host: ArgumentsHost) {
    const { message, sql } = exception as any;
    console.error(exception);
    this.sendError(exception, host, {
      message: `${sql} - ${message}`,
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }

  private sendError(exception: any, host: ArgumentsHost, body: any) {
    const { applicationRef } = this;
    const response = host.getArgByIndex(1);

    if (!applicationRef.isHeadersSent(response)) {
      applicationRef.reply(response, body, body.statusCode);
    } else {
      applicationRef.end(response);
    }

    this.logException(exception);
  }

  private logException(exception: any) {
    if (this.isExceptionObject(exception)) {
      return ExceptionsCatchFilter.subLogger.error(exception.message, exception.stack);
    }
    return ExceptionsCatchFilter.subLogger.error(exception);
  }
}
