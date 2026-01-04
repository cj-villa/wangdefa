import { AUTO_GLOBAL_CONFIGURATION_LOADER, AUTO_GLOBAL_INSTANCE } from '../constant';
import { AutoGlobalModuleConfig } from '../auto-global.type';

export const createInstance = () => ({
  provide: AUTO_GLOBAL_INSTANCE,
  useFactory: async (config: AutoGlobalModuleConfig) => {},
  inject: [AUTO_GLOBAL_CONFIGURATION_LOADER],
});
