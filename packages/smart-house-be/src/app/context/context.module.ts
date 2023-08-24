import { Global, Module } from '@nestjs/common';
import { getModules } from '@/utils';

@Global()
@Module(getModules(__dirname, { loop: true }))
export class ContextModule {}
