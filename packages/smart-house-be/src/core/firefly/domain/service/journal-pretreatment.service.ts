import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BillCommand, BillFieldType, JournalCommand, JournalFieldType } from '@/core/firefly';
import { Repository } from 'typeorm';
import { parseJson, stringifyJson } from '@/shared/toolkits/transform';
import { InjectRequest } from '@/interface/decorate/inject-request';
import { JwtUser } from '@/core/user';
import { keyBy } from 'lodash';
import { InjectLogger, type LokiLogger } from '@/interface/decorate/inject-logger';
import { JournalMeta } from '@/core/firefly/domain/entities/journal-meta.entity';
import { FireflyParsingRules } from '@/core/firefly/domain/entities/firefly-parsing-rules.entity';

@Injectable()
export class JournalPretreatmentService {
  @InjectLogger(JournalPretreatmentService.name)
  private readonly logger: LokiLogger;

  @InjectRepository(JournalMeta, '__firefly__')
  private readonly journalMeta: Repository<JournalMeta>;

  @InjectRepository(FireflyParsingRules)
  private readonly fireflyParsingRules: Repository<FireflyParsingRules>;

  @InjectRequest('user')
  private readonly userInfo: JwtUser;

  // 需要解析的字段
  private readonly billTransferDirectory: Record<
    JournalFieldType,
    { field: BillFieldType; parse?: boolean | ((value: string) => string) }
  > = {
    [JournalFieldType.Type]: {
      field: BillFieldType.Direction,
      parse: (value) => (value === '支出' ? 'expense' : 'income'),
    },
    [JournalFieldType.Amount]: { field: BillFieldType.Amount },
    [JournalFieldType.Time]: { field: BillFieldType.DateTime },
    [JournalFieldType.Tag]: { field: BillFieldType.Description, parse: true },
    [JournalFieldType.Budget]: { field: BillFieldType.Description, parse: true },
    [JournalFieldType.Category]: { field: BillFieldType.Description, parse: true },
    [JournalFieldType.Source]: { field: BillFieldType.PaymentMethod, parse: true },
    [JournalFieldType.Target]: { field: BillFieldType.Counterparty, parse: true },
    [JournalFieldType.Description]: { field: BillFieldType.Description },
    [JournalFieldType.TradeNo]: { field: BillFieldType.TradeNo },
  };

  // 目标源
  private readonly analysisTarget: JournalFieldType[] = Object.keys(
    this.billTransferDirectory
  ).filter(
    (journalType) => this.billTransferDirectory[journalType].parse === true
  ) as JournalFieldType[];

  // 解析源
  private readonly analysisSource: BillFieldType[] = [
    ...new Set(
      Object.values(this.billTransferDirectory)
        .filter((item) => item.parse === true)
        .map((item) => item.field)
    ),
  ];

  private async treatmentBill(bill: BillCommand): Promise<JournalCommand | false> {
    const { billTransferDirectory } = this;
    let parseAll = true;
    const parseRule = keyBy(
      await this.fireflyParsingRules.findBy(
        this.analysisSource.map((type) => ({
          userId: this.userInfo.userId,
          analysisType: type,
          source: bill[type],
        }))
      ),
      'type'
    );
    const journal = new JournalCommand();
    // 遍历需要预处理的字段
    for (const journalField of Object.keys(billTransferDirectory)) {
      const directory = billTransferDirectory[journalField as keyof typeof billTransferDirectory];
      const { field: billField, parse } = directory;
      if (!parse) {
        journal[journalField] = bill[billField];
      } else if (parse === true) {
        /** 从数据库中解析 */
        const rule = parseRule[journalField];
        parseAll = true && !!rule;
        if (rule) {
          journal[journalField] = rule.target;
        }
      } else if (typeof parse === 'function') {
        journal[journalField] = parse(bill[billField]);
      } else {
        parseAll = false;
      }
    }
    journal.hint = stringifyJson(bill);
    return parseAll && journal;
  }

  /**
   * @description 预处理提示词，若当前提示词是从导出的 excel 中获取的，则先从过去处理过的提示词的规则中筛选出不需要过 AI 处理的提示词，节省成本加快速度
   * @returns 预处理后的提示词 null 表示当前提示词不需要过 AI 处理 false 表示当前提示词需要过 AI 处理 其余返回值表示预处理后的提示词
   * */
  async preTreatmentHint(hint: string) {
    const data = parseJson<BillCommand>(hint, { defaultJson: null });
    // 没有数据或没有金额直接返回源数据
    if (!data?.amount) {
      return false;
    }
    const { tradeNo } = data;
    const meta = await this.journalMeta.findOneBy({ name: 'internal_reference', data: tradeNo });
    // 当前订单已经处理过了，直接跳过
    if (meta) {
      return null;
    }
    return this.treatmentBill(data);
  }

  async batchSavePretreatmentRule(hints: string[], journal: JournalCommand[]) {
    const { billTransferDirectory, analysisTarget } = this;
    const bills: BillCommand[] = hints.map((hint) => parseJson(hint));
    const journalMap = keyBy(journal, 'tradeNo');
    for (const bill of bills) {
      const journal = journalMap[bill.tradeNo];
      if (journal) {
        for (const journalField of analysisTarget) {
          const billField = billTransferDirectory[journalField].field;
          const fireflyParsingRule = this.fireflyParsingRules.create({
            userId: this.userInfo.userId,
            type: journalField,
            analysisType: billField,
            target: String(journal[journalField] ?? ''),
            source: bill[billField],
          });
          const isExist = await this.fireflyParsingRules.findOneBy(fireflyParsingRule);
          if (!isExist) {
            await this.fireflyParsingRules.save(fireflyParsingRule).catch((error) => {
              this.logger.error(error);
            });
          }
        }
      }
    }
  }
}
