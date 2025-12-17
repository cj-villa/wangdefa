import { Module } from '@nestjs/common';
import { FireflyController } from './firefly.controller';

@Module({
  imports: [],
  controllers: [FireflyController],
  providers: [],
})
export class FireflyModule {}
