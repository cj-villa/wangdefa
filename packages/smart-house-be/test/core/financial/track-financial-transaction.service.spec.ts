import { requestContext } from '../../../src/interface/interceptor/request-context';
import { FinancialTransactionType } from '@/core/financial/application/enum/financial-transaction-type';
import { TrackFinancialTransactionService } from '@/core/financial/domain/service/track-financial-transaction.service';

describe('TrackFinancialTransactionService', () => {
  const createTransactionEntityLike = (
    partial: Partial<{
      financialId: string;
      amount: number;
      fee: number;
      transactionType: FinancialTransactionType;
      ensureDate: Date;
    }>
  ) => {
    return {
      financialId: partial.financialId ?? 'f1',
      amount: partial.amount ?? 0,
      fee: partial.fee ?? 0,
      ensureDate: partial.ensureDate ?? new Date(),
      transactionType: partial.transactionType ?? FinancialTransactionType.BUY,
      get effectiveAmount() {
        return Number(
          this.amount +
            (this.transactionType === FinancialTransactionType.BUY ? -this.fee : +this.fee)
        );
      },
      get value() {
        const effectiveAmount = Math.max(0, Number(this.amount) - Number(this.fee ?? 0));
        return Number(
          this.transactionType === FinancialTransactionType.BUY ? effectiveAmount : -effectiveAmount
        );
      },
    };
  };

  const transactionRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
  };
  const trackFinancialRepo = {
    findOneBy: jest.fn(),
  };
  const financialNetValueService = {
    getFinancialNetValueTrendByExistingDays: jest.fn(),
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
    const transaction = createTransactionEntityLike({
      financialId: 'f1',
      amount: 100,
      fee: 2,
      ensureDate: new Date('2024-01-02T00:00:00.000Z'),
      transactionType: FinancialTransactionType.BUY,
    }) as any;

    const trend = {
      getSharesByAmount: jest.fn().mockReturnValue(10),
    };

    trackFinancialRepo.findOneBy.mockResolvedValue(financial);
    transactionRepo.create.mockReturnValue(transaction);
    financialNetValueService.getFinancialNetValueTrendByExistingDays.mockResolvedValue(trend);
    transactionRepo.save.mockResolvedValue({ id: 't1' });

    await service.create({
      financialId: 'f1',
      transactionType: FinancialTransactionType.BUY,
      amount: '100',
      fee: '2',
      transactionDate: '2024-01-01T00:00:00.000Z',
      ensureDate: '2024-01-02T00:00:00.000Z',
    } as any);

    expect(financialNetValueService.getFinancialNetValueTrendByExistingDays).toHaveBeenCalledWith(
      financial,
      transaction.ensureDate,
      financial.delay
    );
    expect(trend.getSharesByAmount).toHaveBeenCalledWith(financial, 98);
  });

  it('create should still compute shares by effectiveAmount when amount is smaller than fee', async () => {
    const trend = {
      getSharesByAmount: jest.fn().mockReturnValue(0),
    };
    trackFinancialRepo.findOneBy.mockResolvedValue({ id: 'f1', userId: 'u1', delay: 1 });
    transactionRepo.create.mockReturnValue(
      createTransactionEntityLike({
        financialId: 'f1',
        amount: 100,
        fee: 200,
        ensureDate: new Date('2024-01-02T00:00:00.000Z'),
        transactionType: FinancialTransactionType.BUY,
      })
    );
    financialNetValueService.getFinancialNetValueTrendByExistingDays.mockResolvedValue(trend);
    transactionRepo.save.mockResolvedValue({ id: 't1' });

    await service.create({
      financialId: 'f1',
      transactionType: FinancialTransactionType.BUY,
      amount: '100',
      fee: '200',
      transactionDate: '2024-01-01T00:00:00.000Z',
      ensureDate: '2024-01-02T00:00:00.000Z',
    } as any);

    expect(trend.getSharesByAmount).toHaveBeenCalledWith(expect.any(Object), -100);
  });

  it('getFinancialAmount should aggregate effective amount with fee deduction', async () => {
    jest.spyOn(service, 'list').mockResolvedValue([
      [
        createTransactionEntityLike({
          amount: 100,
          fee: 2,
          transactionType: FinancialTransactionType.BUY,
        }),
        createTransactionEntityLike({
          amount: 50,
          fee: 2,
          transactionType: FinancialTransactionType.SELL,
        }),
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
