import { Module } from '@nestjs/common';
import { TokenModule } from './token/token.module';
import { SystemConfigController } from './consul.controller';

@Module({
  imports: [TokenModule],
  controllers: [SystemConfigController],
  exports: [TokenModule],
})
export class SystemModule {}
