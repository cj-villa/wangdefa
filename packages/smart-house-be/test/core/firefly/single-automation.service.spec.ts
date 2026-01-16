import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SingleAutomationService } from '../../../src/core/firefly/domain/service/single-automation.service';
import { JournalPretreatmentService } from '../../../src/core/firefly/domain/service/journal-pretreatment.service';
import { JournalMeta } from '../../../src/core/firefly/domain/entities/journal-meta.entity';
import { FireflyParsingRules } from '../../../src/core/firefly/domain/entities/firefly-parsing-rules.entity';
import { REDIS_INSTANCE } from '../../../src/infrastructure/redis';
import { DIFY_BASE_SERVICE } from '../../../src/infrastructure/dify';
import { BillFieldType, JournalFieldType } from '../../../src/core/firefly';
import { requestContext } from '../../../src/interface/interceptor/request-context';
import axios from 'axios';

const missingAccounts = [];

describe('自动化处理账单', () => {
  let module: TestingModule;

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

  beforeAll(async () => {
    const journalMetaRepo = { findOneBy: jest.fn() };
    const fireflyParsingRulesMetaRepo = {
      findBy: jest.fn().mockImplementation((filter) =>
        filter?.[0]?.source !== '渝八两重庆鸡公煲(萧山万象汇店)外卖订单'
          ? []
          : [
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
            ]
      ),
      create: jest.fn(),
      findOneBy: jest.fn(),
      save: jest.fn().mockReturnValue(Promise.resolve()),
    };
    const redis = { lPush: jest.fn(), expire: jest.fn(), lRange: jest.fn(), lmPop: jest.fn() };
    const difyService = {
      post: jest.fn().mockReturnValue(
        Promise.resolve(`data: {"event":"text_chunk","workflow_run_id":"4dfa711b-139c-4159-985b-4fac1db155e0","task_id":"5f00ac29-2d6a-46ed-ba52-91e79e465cac","data":{"text":"<think>\\n好的，","from_variable_selector":["1765781476495","text"]}}

data: {"event":"workflow_finished","workflow_run_id":"4dfa711b-139c-4159-985b-4fac1db155e0","task_id":"5f00ac29-2d6a-46ed-ba52-91e79e465cac","data":{"id":"4dfa711b-139c-4159-985b-4fac1db155e0","workflow_id":"2a8fd33f-787c-4583-9b9e-bee715f0290b","status":"succeeded","outputs":{"text":"<think>\\n好的，我现在需要处理用户提供的两个交易记录，并按照给定的规则解析成符合要求的JSON格式。首先，我得仔细阅读用户输入的文本，理解每个字段对应的信息。\\n\\n首先看第一个交易记录：\\n{\\n  \\"dateTime\\":\\"2025-12-24 11:11:43\\",\\n  \\"category\\":\\"餐饮美食\\",\\n  \\"counterparty\\":\\"淘宝闪购\\",\\n  \\"counterpartyAccount\\":\\"e50***@alibaba-inc.com\\",\\n  \\"description\\":\\"渝八两重庆鸡公煲(萧山万象汇店)外卖订单\\",\\n  \\"direction\\":\\"支出\\",\\n  \\"amount\\":\\"20.80\\",\\n  \\"paymentMethod\\":\\"云闪付-招商银行(4433)\\",\\n  \\"status\\":\\"交易成功\\",\\n  \\"tradeNo\\":\\"2025122422001175871420785762\\",\\n  \\"merchantOrderNo\\":\\"13110600725122496316035460088\\",\\n  \\"remark\\":\\"\\"\\n}\\n\\n这个交易的方向是支出，所以类型应该是expense。根据规则，expense的source是支出账户，而target是消费对象，但这里需要映射source为有效的支出账户。用户提供的支出账户列表包括\\"泽伟\\"、\\"美团外卖\\"等，但这里paymentMethod是云闪付-招商银行，而系统中的收入账户有招商银行，但支出账户里没有招商银行。所以可能这里需要检查支出账户列表是否有对应的账户。比如，支出账户列表中的\\"招商银行\\"是否存在于支出账户里？根据用户给出的支出账户列表，只有\\"泽伟\\"、\\"美团外卖\\"和\\"destination_name\\"，所以招商银行不在支出账户中，这可能导致source账户不存在。\\n\\n接下来是第二个交易：\\n{\\n  \\"dateTime\\":\\"2025-12-24 09:18:53\\",\\n  \\"category\\":\\"日用百货\\",\\n  \\"counterparty\\":\\"淘宝闪购\\",\\n  \\"counterpartyAccount\\":\\"ele***@service.aliyun.com\\",\\n  \\"description\\":\\"天猫超市闪购(杭州店)\\",\\n  \\"direction\\":\\"支出\\",\\n  \\"amount\\":\\"34.80\\",\\n  \\"paymentMethod\\":\\"广发银行信用卡(0202)\\",\\n  \\"status\\":\\"支付成功\\",\\n  \\"tradeNo\\":\\"2025122422001175871421617890\\",\\n  \\"merchantOrderNo\\":\\"13090600725122456515315460088\\",\\n  \\"remark\\":\\"\\"\\n}\\n\\n同样，方向是支出，类型expense。paymentMethod是广发银行信用卡，但支出账户列表中也没有广发银行，所以source账户可能不存在。\\n\\n现在，我需要根据规则来判断每个交易的source是否在支出账户列表中。对于第一个交易的source是云闪付-招商银行，但支出账户里没有招商银行，所以source不存在。同样第二个交易的source是广发银行信用卡，也不在支出账户列表中。因此，这两个交易的status应该是account_not_found，并且missing_accounts数组里包含对应的source账户名称。\\n\\n接下来，构造每个订单的JSON。对于第一个订单：\\n- type是expense\\n- amount是20.80\\n- time是2025-12-24 11:11:43\\n- description是原始描述\\n- tradeNo是给定的\\n- source是云闪付-招商银行，但不在支出账户列表中，所以会被加入missing_accounts\\n- target根据expense规则，未说明时默认现金账户，但这里可能需要看是否有其他信息。不过根据paymentMethod，可能source是支付卡，但系统中的支出账户没有对应的，所以source无效。\\n同样第二个交易的source是广发银行信用卡，不在支出账户中。\\n\\n因此，两个交易的status都是account_not_found，missing_accounts数组包含这两个source账户名称。然后每个订单的其他字段需要填充，比如tag、budget、category等。根据系统中的预算类型有\\"餐饮\\"，分类可能需要对应category字段中的值，比如第一个的category是餐饮美食，可能对应到预算中的\\"餐饮\\"。标签可能留空，因为系统中的标签列表只有\\"tag\\"，但用户可能没有指定，所以留空。\\n\\n最后，确保输出的JSON符合格式，没有额外字段，并且所有必填字段都存在。比如，每个order中的source和target是否正确，amount是否为数字，时间格式是否正确。\\n</think>\`\`\`json\\n{\\n  \\"status\\": \\"account_not_found\\",\\n  \\"missing_accounts\\": [\\"云闪付-招商银行(4433)\\", \\"广发银行信用卡(0202)\\"],\\n  \\"order\\": [\\n    {\\n      \\"type\\": \\"expense\\",\\n      \\"amount\\": 20.8,\\n      \\"time\\": \\"2025-12-24 11:11:43\\",\\n      \\"tag\\": \\"\\",\\n      \\"budget\\": \\"餐饮\\",\\n      \\"category\\": \\"餐饮美食\\",\\n      \\"source\\": \\"云闪付-招商银行(4433)\\",\\n      \\"target\\": \\"现金账户\\",\\n      \\"description\\": \\"渝八两重庆鸡公煲(萧山万象汇店)外卖订单\\",\\n      \\"tradeNo\\": \\"2025122422001175871420785762\\"\\n    },\\n    {\\n      \\"type\\": \\"expense\\",\\n      \\"amount\\": 34.8,\\n      \\"time\\": \\"2025-12-24 09:18:53\\",\\n      \\"tag\\": \\"\\",\\n      \\"budget\\": \\"预算\\",\\n      \\"category\\": \\"日用百货\\",\\n      \\"source\\": \\"广发银行信用卡(0202)\\",\\n      \\"target\\": \\"现金账户\\",\\n      \\"description\\": \\"天猫超市闪购(杭州店)\\",\\n      \\"tradeNo\\": \\"2025122422001175871421617890\\"\\n    }\\n  ]\\n}\\n\`\`\`"},"error":null,"elapsed_time":47.772028,"total_tokens":2521,"total_steps":5,"created_by":{"id":"e93f1b69-6a1f-4f69-88cd-a45957786fb8","user":"system"},"created_at":1768207594,"finished_at":1768207642,"exceptions_count":0,"files":[]}}
`)
      ),
    };
    module = await Test.createTestingModule({
      providers: [
        SingleAutomationService,
        JournalPretreatmentService,
        {
          provide: DIFY_BASE_SERVICE,
          useValue: difyService,
        },
        {
          provide: getRepositoryToken(JournalMeta, '__firefly__'),
          useValue: journalMetaRepo,
        },
        {
          provide: getRepositoryToken(FireflyParsingRules),
          useValue: fireflyParsingRulesMetaRepo,
        },
        {
          provide: REDIS_INSTANCE,
          useValue: redis,
        },
      ],
    }).compile();
  });

  it('正确识别支付宝账单', async () => {
    const singleAutomationService = module.get(SingleAutomationService);
    const result = await singleAutomationService.cleanHits([
      '{"dateTime":"2025-12-24 11:11:43","category":"餐饮美食","counterparty":"淘宝闪购","counterpartyAccount":"e50***@alibaba-inc.com","description":"渝八两重庆鸡公煲(萧山万象汇店)外卖订单","direction":"支出","amount":"20.80","paymentMethod":"云闪付-招商银行(4433)","status":"交易成功","tradeNo":"2025122422001175871420785762","merchantOrderNo":"13110600725122496316035460088","remark":""}',
      '{"dateTime":"2025-12-24 09:18:53","category":"日用百货","counterparty":"淘宝闪购","counterpartyAccount":"ele***@service.aliyun.com","description":"天猫超市闪购(杭州店)","direction":"支出","amount":"34.80","paymentMethod":"广发银行信用卡(0202)","status":"支付成功","tradeNo":"2025122422001175871421617890","merchantOrderNo":"13090600725122456515315460088","remark":""}',
    ]);
    expect(result).toMatchObject({
      difyHints: [
        '{"dateTime":"2025-12-24 09:18:53","category":"日用百货","counterparty":"淘宝闪购","counterpartyAccount":"ele***@service.aliyun.com","description":"天猫超市闪购(杭州店)","direction":"支出","amount":"34.80","paymentMethod":"广发银行信用卡(0202)","status":"支付成功","tradeNo":"2025122422001175871421617890","merchantOrderNo":"13090600725122456515315460088","remark":""}',
      ],
      missing_accounts: ['云闪付-招商银行(4433)', '广发银行信用卡(0202)'],
      journals: [
        {
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
        },
        {
          type: 'expense',
          amount: 20.8,
          time: '2025-12-24 11:11:43',
          tag: '',
          budget: '餐饮',
          category: '餐饮美食',
          source: '云闪付-招商银行(4433)',
          target: '现金账户',
          description: '渝八两重庆鸡公煲(萧山万象汇店)外卖订单',
          tradeNo: '2025122422001175871420785762',
        },
        {
          type: 'expense',
          amount: 34.8,
          time: '2025-12-24 09:18:53',
          tag: '',
          budget: '预算',
          category: '日用百货',
          source: '广发银行信用卡(0202)',
          target: '现金账户',
          description: '天猫超市闪购(杭州店)',
          tradeNo: '2025122422001175871421617890',
        },
      ],
    });
  });
});
