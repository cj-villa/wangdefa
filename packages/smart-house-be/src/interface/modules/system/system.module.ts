import { Module } from '@nestjs/common';
import { SystemConfigController } from './consul.controller';
import { TokenModule } from './token/token.module';

@Module({
  imports: [TokenModule],
  controllers: [SystemConfigController],
  exports: [TokenModule],
})
export class SystemModule {}
