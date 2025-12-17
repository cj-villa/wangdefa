import { Module } from '@nestjs/common';
import { FallbackController } from '@/interface/modules/fallback/fallback.controller';

@Module({
  controllers: [FallbackController],
})
export class FallbackModule {}
