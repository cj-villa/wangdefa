export const calculation = <T = unknown, K extends keyof T = keyof T>(
  target: T[],
  key: K,
  method: (prev: T[K] | undefined, value: T[K]) => T[K],
  initialValue?: T[K]
) => {
  return target.reduce((prev, cur) => method(prev, cur[key]), initialValue);
};

export const sum = <T = unknown, K extends keyof T = keyof T>(
  target: T[],
  key: K,
  initialValue = 0
) => {
  return target.reduce((prev, cur) => prev + Number(cur[key]), initialValue);
};
