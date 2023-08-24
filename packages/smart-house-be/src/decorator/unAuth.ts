import { SetMetadata } from '@nestjs/common';
import { AuthSwitch } from '@/constant/reflect';

export const UnAuth = () => {
  return SetMetadata(AuthSwitch, true);
};
