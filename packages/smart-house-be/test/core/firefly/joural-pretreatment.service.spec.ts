import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JournalPretreatmentService } from '../../../src/core/firefly/domain/service/journal-pretreatment.service';
import { FireflyParsingRules } from '../../../src/core/firefly/domain/entities/firefly-parsing-rules.entity';
import { JournalMeta } from '../../../src/core/firefly/domain/entities/journal-meta.entity';
import { requestContext } from '../../../src/interface/interceptor/request-context';
import { BillFieldType } from '../../../src/core/firefly/application/enum/bill-field-type';
import { JournalFieldType } from '../../../src/core/firefly/application/enum/journal-field-type';
import { JournalCommand } from '../../../src/core/firefly';

const hint = {
  dateTime: '2025-12-24 11:11:43',
  category: '餐饮美食',
  counterparty: '淘宝闪购',
  counterpartyAccount: 'e50***@alibaba-inc.com',
  description: '渝八两重庆鸡公煲(萧山万象汇店)外卖订单',
  direction: '支出',
  amount: '20.80',
  paymentMethod: '云闪付-招商银行(4433)',
  status: '交易成功',
  tradeNo: '2025122422001175871420785762',
  merchantOrderNo: '13110600725122496316035460088',
  remark: '',
};

describe('账单预处理逻辑', () => {
  beforeEach(() => {
    jest.spyOn(requestContext, 'getStore').mockReturnValue({
      user: {
        userId: '1',
        nickName: 'nickName',
        username: 'username',
        email: 'email',
      },
    });
  });

  it('非JSON或无金额数据直接返回 false', async () => {
    const journalMetaRepo = { findOneBy: jest.fn() };
    const fireflyParsingRulesMetaRepo = { findBy: jest.fn() };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JournalPretreatmentService,
        {
          provide: getRepositoryToken(JournalMeta, '__firefly__'),
          useValue: journalMetaRepo,
        },
        {
          provide: getRepositoryToken(FireflyParsingRules),
          useValue: fireflyParsingRulesMetaRepo,
        },
      ],
    }).compile();
    const journalPretreatmentService = module.get(JournalPretreatmentService);
    const result = await journalPretreatmentService.preTreatmentHint('JSON.stringify(hint)');
    expect(result).toBeFalsy();
    const result2 = await journalPretreatmentService.preTreatmentHint(JSON.stringify({ a: 1 }));
    expect(result2).toBeFalsy();
  });

  it('已处理的订单返回null', async () => {
    const journalMetaRepo = { findOneBy: jest.fn().mockReturnValue({ id: 1 }) };
    const fireflyParsingRulesMetaRepo = { findBy: jest.fn() };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JournalPretreatmentService,
        {
          provide: getRepositoryToken(JournalMeta, '__firefly__'),
          useValue: journalMetaRepo,
        },
        {
          provide: getRepositoryToken(FireflyParsingRules),
          useValue: fireflyParsingRulesMetaRepo,
        },
      ],
    }).compile();
    const journalPretreatmentService = module.get(JournalPretreatmentService);
    const result = await journalPretreatmentService.preTreatmentHint(JSON.stringify(hint));
    expect(result).toBeNull();
  });

  it('无对应的信息返回false', async () => {
    const journalMetaRepo = { findOneBy: jest.fn() };
    const fireflyParsingRulesMetaRepo = { findBy: jest.fn() };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JournalPretreatmentService,
        {
          provide: getRepositoryToken(JournalMeta, '__firefly__'),
          useValue: journalMetaRepo,
        },
        {
          provide: getRepositoryToken(FireflyParsingRules),
          useValue: fireflyParsingRulesMetaRepo,
        },
      ],
    }).compile();
    const journalPretreatmentService = module.get(JournalPretreatmentService);
    const result = await journalPretreatmentService.preTreatmentHint(JSON.stringify(hint));
    expect(result).toBeFalsy();
  });

  it('包含全部的信息返回解析后的journal数据', async () => {
    const journalMetaRepo = { findOneBy: jest.fn() };
    const fireflyParsingRulesMetaRepo = {
      findBy: jest.fn().mockReturnValue([
        {
          type: JournalFieldType.Tag,
          analysisType: BillFieldType.Description,
          source: '渝八两重庆鸡公煲(萧山万象汇店)外卖订单',
          target: '午饭',
        },
        {
          type: JournalFieldType.Budget,
          analysisType: BillFieldType.Description,
          source: '渝八两重庆鸡公煲(萧山万象汇店)外卖订单',
          target: '餐饮',
        },
        {
          type: JournalFieldType.Category,
          analysisType: BillFieldType.Description,
          source: '渝八两重庆鸡公煲(萧山万象汇店)外卖订单',
          target: '日常餐饮',
        },
        {
          type: JournalFieldType.Source,
          analysisType: BillFieldType.PaymentMethod,
          source: '云闪付-招商银行(4433)',
          target: '招商银行信用卡',
        },
        {
          type: JournalFieldType.Target,
          analysisType: BillFieldType.Counterparty,
          source: '淘宝闪购',
          target: '淘宝',
        },
      ]),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JournalPretreatmentService,
        {
          provide: getRepositoryToken(JournalMeta, '__firefly__'),
          useValue: journalMetaRepo,
        },
        {
          provide: getRepositoryToken(FireflyParsingRules),
          useValue: fireflyParsingRulesMetaRepo,
        },
      ],
    }).compile();
    const journalPretreatmentService = module.get(JournalPretreatmentService);
    const result = (await journalPretreatmentService.preTreatmentHint(
      JSON.stringify(hint)
    )) as JournalCommand;
    expect(result).toMatchObject({
      amount: '20.80',
      budget: '餐饮',
      category: '日常餐饮',
      description: '渝八两重庆鸡公煲(萧山万象汇店)外卖订单',
      source: '招商银行信用卡',
      tag: '午饭',
      target: '淘宝',
      time: '2025-12-24 11:11:43',
      tradeNo: '2025122422001175871420785762',
      type: 'expense',
    });
  });

  it('有未解析的数据时，返回false', async () => {
    const journalMetaRepo = { findOneBy: jest.fn() };
    const fireflyParsingRulesMetaRepo = {
      findBy: jest.fn().mockReturnValue([
        {
          type: JournalFieldType.Tag,
          analysisType: BillFieldType.Description,
          source: '渝八两重庆鸡公煲(萧山万象汇店)外卖订单',
          target: '午饭',
        },
      ]),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JournalPretreatmentService,
        {
          provide: getRepositoryToken(JournalMeta, '__firefly__'),
          useValue: journalMetaRepo,
        },
        {
          provide: getRepositoryToken(FireflyParsingRules),
          useValue: fireflyParsingRulesMetaRepo,
        },
      ],
    }).compile();
    const journalPretreatmentService = module.get(JournalPretreatmentService);
    const result = (await journalPretreatmentService.preTreatmentHint(
        JSON.stringify(hint)
    )) as JournalCommand;
    expect(result).toBeFalsy();
  });
});
