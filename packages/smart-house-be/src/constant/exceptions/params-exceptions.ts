import { HttpStatus } from '@nestjs/common';
import { BusinessException } from './business-exceptions';

export class ParamsException extends BusinessException {
  constructor(message: string | Record<string, any> | Error, cause?: Error) {
    super(message, HttpStatus.BAD_REQUEST, { cause, description: 'Params Type Illegal' });
  }
}
