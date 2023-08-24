import { In } from 'typeorm';

export const getInFilter = <T extends any = any>(key: string, value: T | T[]) => {
  if (Array.isArray(value)) {
    if (!value.length) {
      return;
    }
    return { [key]: In<T>(value) };
  }
  if (typeof value === 'undefined') {
    return;
  }
  return { [key]: value };
};
