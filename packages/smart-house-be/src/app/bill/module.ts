import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConvertRuleModule } from '@/app/convert-rule/moduel';
import { BillQueueName } from '@/constant/index';
import { BillSourceEntityFeature } from '@/entities';
import { getModules } from '@/utils';

@Module(
  getModules(__dirname, {
    loop: true,
    mergeModule: {
      imports: [
        BillSourceEntityFeature,
        ConvertRuleModule,
        BullModule.registerQueue({
          name: BillQueueName,
        }),
      ],
    },
  })
)
export class BillModule {}
