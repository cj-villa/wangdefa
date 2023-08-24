import { Module } from '@nestjs/common';
import { getModules } from '@/utils';

@Module(
  getModules(__dirname, {
    loop: true,
  })
)
export class AccountModule {}
