/** 校验接口参数 */
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { ParamsException } from '@/constant/index';

const findConstraints = (error: ValidationError) => {
  if (error.constraints) {
    return error.constraints;
  }
  const child = error.children?.[0];
  if (!child) {
    return null;
  }
  return findConstraints(child);
};

@Injectable()
class Validation implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      const constraints = findConstraints(errors[0]);
      if (constraints) {
        throw new ParamsException(Object.values(constraints)[0]);
      } else {
        throw new ParamsException('参数未知错误');
      }
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}

export const validationPipe = {
  provide: APP_PIPE,
  useClass: Validation,
};
