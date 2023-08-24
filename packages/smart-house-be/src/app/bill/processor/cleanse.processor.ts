/** 账单清洗脚本，清洗元数据至可用的数据 */
import { InsertType } from '@l/shared';
import { OnQueueActive, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import type { Job } from 'bull';
import { ConvertRuleModelService } from '@/app/convert-rule/service';
import { BillQueueName, BillQueueAnalyzeTaskName } from '@/constant/queue';
import type { BillSourceEntity } from '@/entities';

@Processor(BillQueueName)
export class BillCleanseConsumer {
  constructor(
    @Inject(ConvertRuleModelService) private convertRuleModuleService: ConvertRuleModelService
  ) {
    console.log(this.convertRuleModuleService);
  }

  @Process({ name: BillQueueAnalyzeTaskName, concurrency: 10 })
  async transcode(job: Job<InsertType<BillSourceEntity>>) {
    // let progress = 0;
    // for (let i = 0; i < 2; i++) {
    //   console.log(job, 'test');
    //   progress += 1;
    //   await job.progress(progress);
    // }
    await job.progress(0);
    console.log('job', job);
    await job.progress(100);
    return {};
  }

  @OnQueueFailed()
  onFailed(error) {
    console.log('test fail', error);
  }

  @OnQueueActive()
  onActive(job: Job) {
    console.log(`Processing job ${job.id} of type ${job.name} with data ${job.data}...`);
  }
}
