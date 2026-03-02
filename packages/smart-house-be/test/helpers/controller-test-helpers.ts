type Constructor<T> = new (...args: never[]) => T;

export function createController<T>(
  ControllerClass: Constructor<T>,
  deps: Record<string, unknown>
): T {
  const controller = new ControllerClass();
  for (const [key, value] of Object.entries(deps)) {
    Object.defineProperty(controller, key, { value, configurable: true });
  }
  return controller;
}
