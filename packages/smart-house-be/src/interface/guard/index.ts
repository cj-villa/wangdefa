import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { PublicGuard } from './public.guard';

export const GuardProviders = [
  {
    provide: APP_GUARD,
    useClass: PublicGuard,
  },
  {
    provide: APP_GUARD,
    useClass: AuthGuard,
  },
];

export { Public } from './public.guard';
export { NoAuth } from './auth.guard';
