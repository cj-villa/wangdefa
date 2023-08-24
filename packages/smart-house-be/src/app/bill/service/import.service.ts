import { BillSourceEnum, InsertType } from '@l/shared';
import { InjectQueue } from '@nestjs/bull';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bull';
import type { Repository } from 'typeorm';
import { UserContext } from '@/app/context/service';
import { FileCacheService } from '@/app/file/service';
import { BillQueueName, BillQueueAnalyzeTaskName } from '@/constant/index';
import { BillSourceEntity } from '@/entities';
import { decodeFile, getInFilter, isDate } from '@/utils';

@Injectable()
export class BillImportService {
  private logger = new Logger(BillImportService.name);
  private BILL_INSERT_LENGTH = 10;

  constructor(
    @Inject(FileCacheService) private fileCacheService: FileCacheService,
    @Inject(UserContext) private userContext: UserContext,
    @InjectRepository(BillSourceEntity) private billSource: Repository<BillSourceEntity>,
    @InjectQueue(BillQueueName) private readonly billQueue: Queue
  ) {}

  async run(bill: Express.Multer.File) {
    /** 异步缓存文件，便于溯源 */
    // this.fileCacheService.WriteCache(bill);
    const content = decodeFile(bill.buffer);
    switch (true) {
      case content.includes('支付宝'):
        await this.analyzeAlipay(content);
    }
    return content;
  }

  private async upsertBill(billRecords: Array<InsertType<BillSourceEntity>>) {
    const billIds = billRecords.map(({ orderNo }) => orderNo);
    const records = await this.billSource.find({ where: getInFilter('orderNo', billIds) });
    const hadIds = records.reduce<Record<string, true>>((idMap, record) => {
      idMap[record.orderNo] = true;
      return idMap;
    }, {});
    const newBill = billRecords.reduce<Array<InsertType<BillSourceEntity>>>((list, record) => {
      this.billQueue.add(BillQueueAnalyzeTaskName, record);
      if (hadIds[record.orderNo]) {
        this.logger.log(`订单号 ${record.orderNo} 已存在，忽略该订单`);
        return list;
      }
      this.logger.log(`新增订单 ${record.orderNo}`);
      list.push(record);
      return list;
    }, []);
    return this.billSource.save(newBill);
  }

  private async analyzeAlipay(content: string) {
    const owner = this.userContext.user;

    const rows = content.split('\n');
    let records: Array<InsertType<BillSourceEntity>> = [];
    for (const row of rows) {
      const cols = row.split(',');
      if (cols.length < 3 || !isDate(cols[0])) {
        continue;
      }
      const record = {
        dealAt: cols[0],
        dealType: cols[1].trim(),
        seller: cols[2].trim(),
        sellerAccount: cols[3].trim(),
        goodComment: cols[4].trim(),
        income: cols[5] === '支出' ? -cols[6] : +cols[6],
        payment: cols[7].trim(),
        status: cols[6],
        orderNo: cols[9].trim(),
        sellerOrderNo: cols[10].trim(),
        source: BillSourceEnum.AliPay,
        owner,
      };
      records.push({
        orderNo: record.orderNo,
        sellerOrderNo: record.sellerOrderNo,
        recordDetail: record,
        source: BillSourceEnum.AliPay,
        owner,
      });
      if (records.length >= this.BILL_INSERT_LENGTH) {
        await this.upsertBill(records);
        records = [];
      }
    }
    this.logger.log('上传完成');
  }
}
