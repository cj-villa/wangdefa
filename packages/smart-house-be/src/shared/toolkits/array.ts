export const calculation = <T extends any = any, K extends keyof T = keyof T>(
  target: T[],
  key: K,
  method: (prev: T[K], value: T[K]) => T[K],
  initialValue?: T[K]
) => {
  return target.reduce((prev, cur) => method(prev, cur[key]), initialValue);
};
