import { Global, Module } from '@nestjs/common';
import { UserEntityFeature } from '@/entities';
import { getModules } from '@/utils';

@Global()
@Module(
  getModules(__dirname, {
    loop: true,
    mergeModule: { imports: [UserEntityFeature] },
  })
)
export class UserModule {}
