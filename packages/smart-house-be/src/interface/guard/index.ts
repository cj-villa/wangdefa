import { APP_GUARD } from '@nestjs/core';
import { PublicGuard } from './public.guard';
import { AuthGuard } from './auth.guard';

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
