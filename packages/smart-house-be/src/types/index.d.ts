import type { Request as Req } from 'express';
import type { Users } from '@/entities';

declare global {
  interface Request extends Req {
    user: Users;
  }
}
