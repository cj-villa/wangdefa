import { BadRequestException } from '@nestjs/common';
import { requestContext } from '../../../src/interface/interceptor/request-context';
import { FinancialTransactionType } from '@/core/financial/application/enum/financial-transaction-type';
import { TrackFinancialTransactionService } from '@/core/financial/domain/service/track-financial-transaction.service';

describe('TrackFinancialTransactionService', () => {
  const transactionRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
  };
  const trackFinancialRepo = {
    findOneBy: jest.fn(),
  };
  const financialNetValueService = {
    getFinancialNetValueTrend: jest.fn(),
  };

  const service = new TrackFinancialTransactionService();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(requestContext, 'getStore').mockReturnValue({
      user: { userId: 'u1', username: 'tester' } as any,
    });
    (service as any).transactionRepo = transactionRepo;
    (service as any).trackFinancialRepo = trackFinancialRepo;
    (service as any).financialNetValueService = financialNetValueService;
    (service as any).trackFinancialRecordService = { list: jest.fn() };
  });

  it('create should compute shares using amount minus fee', async () => {
    const financial = { id: 'f1', userId: 'u1', delay: 1 } as any;
    const transaction = {
      financialId: 'f1',
      amount: 100,
      ensureDate: new Date('2024-01-02T00:00:00.000Z'),
      transactionType: FinancialTransactionType.BUY,
    } as any;

    const trend = {
      getSharesByAmount: jest.fn().mockReturnValue(10),
    };

    trackFinancialRepo.findOneBy.mockResolvedValue(financial);
    transactionRepo.create.mockReturnValue(transaction);
    financialNetValueService.getFinancialNetValueTrend.mockResolvedValue(trend);
    transactionRepo.save.mockResolvedValue({ id: 't1' });

    await service.create({
      financialId: 'f1',
      transactionType: FinancialTransactionType.BUY,
      amount: '100',
      fee: '2',
      transactionDate: '2024-01-01T00:00:00.000Z',
      ensureDate: '2024-01-02T00:00:00.000Z',
    } as any);

    expect(trend.getSharesByAmount).toHaveBeenCalledWith(financial, 98);
  });

  it('create should reject when amount is smaller than fee', async () => {
    trackFinancialRepo.findOneBy.mockResolvedValue({ id: 'f1', userId: 'u1', delay: 1 });
    transactionRepo.create.mockReturnValue({
      financialId: 'f1',
      amount: 100,
      ensureDate: new Date('2024-01-02T00:00:00.000Z'),
      transactionType: FinancialTransactionType.BUY,
    });
    financialNetValueService.getFinancialNetValueTrend.mockResolvedValue({
      getSharesByAmount: jest.fn(),
    });

    await expect(
      service.create({
        financialId: 'f1',
        transactionType: FinancialTransactionType.BUY,
        amount: '100',
        fee: '200',
        transactionDate: '2024-01-01T00:00:00.000Z',
        ensureDate: '2024-01-02T00:00:00.000Z',
      } as any)
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('getFinancialAmount should aggregate effective amount with fee deduction', async () => {
    jest.spyOn(service, 'list').mockResolvedValue([
      [
        { amount: 100, fee: 2, transactionType: FinancialTransactionType.BUY },
        { amount: 50, fee: 2, transactionType: FinancialTransactionType.SELL },
      ] as any,
      2,
    ]);

    const amount = await service.getFinancialAmount(
      {
        id: 'f1',
      } as any,
      new Date('2024-01-10T00:00:00.000Z')
    );

    expect(amount).toBe(50);
  });
});
