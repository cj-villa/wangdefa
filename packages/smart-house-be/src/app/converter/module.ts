import { Module } from '@nestjs/common';
import { ConvertRuleModule } from '@/app/convert-rule/moduel';
import { BillConverterEntityFeature } from '@/entities';
import { getModules } from '@/utils';

@Module(
  getModules(__dirname, {
    loop: true,
    mergeModule: {
      imports: [BillConverterEntityFeature, ConvertRuleModule],
    },
  })
)
export class ConverterModule {}
