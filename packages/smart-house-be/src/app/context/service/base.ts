import { Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

export class BaseContext {
  constructor(@Inject(REQUEST) protected request: Request) {}
}
