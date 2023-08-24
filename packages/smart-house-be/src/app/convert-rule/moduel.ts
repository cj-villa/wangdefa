import { Module } from '@nestjs/common';
import { BillConvertRuleEntityFeature } from '@/entities';
import { getModules } from '@/utils';

@Module(
  getModules(__dirname, {
    loop: true,
    mergeModule: {
      imports: [BillConvertRuleEntityFeature],
    },
  })
)
export class ConvertRuleModule {}
