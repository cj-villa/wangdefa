import { type ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export async function validateDto<T extends object>(
  DtoClass: ClassConstructor<T>,
  payload: unknown
) {
  const dto = plainToInstance(DtoClass, payload);
  return validate(dto);
}

export function getErrorProperties(errors: { property: string }[]) {
  return errors.map((error) => error.property);
}
