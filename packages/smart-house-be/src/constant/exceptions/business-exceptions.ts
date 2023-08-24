import { HttpException, HttpStatus } from '@nestjs/common';
import { HttpExceptionOptions } from '@nestjs/common/exceptions/http.exception';

export class BusinessException extends HttpException {
  constructor(
    message: string | Record<string, any> | Error,
    status = HttpStatus.INTERNAL_SERVER_ERROR,
    options?: HttpExceptionOptions
  ) {
    let cause: Error;
    if (message instanceof Error) {
      cause = message;
      message = message.message;
    } else if (typeof message === 'string') {
      cause = new Error(message);
    }

    const { description, httpExceptionOptions } = HttpException.extractDescriptionAndOptionsFrom({
      cause,
      description: 'Business Exceptions',
      ...options,
    });

    super(HttpException.createBody(message, description, status), status, httpExceptionOptions);
  }
}
