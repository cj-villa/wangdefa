import { APP_GUARD } from '@nestjs/core';
import { PublicGuard } from '@/interface/guard/public.guard';

export const GuardProviders = [
  {
    provide: APP_GUARD,
    useClass: PublicGuard,
  },
];

export { Public } from './public.guard';
