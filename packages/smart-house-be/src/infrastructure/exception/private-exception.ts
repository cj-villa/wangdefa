import { HttpException, HttpExceptionOptions } from '@nestjs/common/exceptions/http.exception';
import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

export class PrivateException extends HttpException {
  constructor(
    objectOrError?: string | object | any,
    descriptionOrOptions?: string | HttpExceptionOptions
  ) {
    const { description, httpExceptionOptions } =
      HttpException.extractDescriptionAndOptionsFrom(descriptionOrOptions);

    super(
      HttpException.createBody(objectOrError, description!, HttpStatus.UNAUTHORIZED),
      HttpStatus.UNAUTHORIZED,
      httpExceptionOptions
    );
  }
}

@Catch(PrivateException)
export class PrivateExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    if (response.socket) {
      response.socket?.destroy();
    } else if (response.connection) {
      response.connection?.destroy();
    } else {
      response.status(HttpStatus.NOT_FOUND).end();
    }
  }
}
