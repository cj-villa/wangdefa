import { requestContext } from '../../../src/interface/interceptor/request-context';
import { FinancialAnalyzeService } from '@/core/financial/domain/service/financial-analyze.service';

describe('FinancialAnalyzeService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(requestContext, 'getStore').mockReturnValue({
      user: {
        userId: 'u1',
        username: 'tester',
      } as any,
    });
  });

  it('getSummary should aggregate only selected financial id data', async () => {
    const getRawMany = jest
      .fn()
      .mockResolvedValue([{ financial_id: 'f1', balance: 1000, profit: 25 }]);
    const queryBuilder = {
      innerJoin: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getRawMany,
    };

    const service = new FinancialAnalyzeService();
    (service as any).trackFinancialRepo = {
      findBy: jest.fn().mockResolvedValue([{ id: 'f1' }]),
    };
    (service as any).financialValueTrendRepo = {
      createQueryBuilder: jest.fn().mockReturnValue(queryBuilder),
    };
    (service as any).transactionRepo = {
      findBy: jest.fn().mockResolvedValue([{ value: 100 }, { value: -20 }]),
    };

    const summary = await service.getSummary('f1');

    expect((service as any).trackFinancialRepo.findBy).toHaveBeenCalledWith({
      id: 'f1',
      userId: 'u1',
    });
    expect(queryBuilder.where).toHaveBeenCalledWith('vt.financial_id IN (:...financialIds)', {
      financialIds: ['f1'],
    });
    expect((service as any).transactionRepo.findBy).toHaveBeenCalledWith({
      userId: 'u1',
      financialId: expect.any(Object),
    });
    expect(summary).toMatchObject({
      productCount: 1,
      totalAssets: 1000,
      totalCost: 80,
      preDayProfit: 25,
    });
  });
});
