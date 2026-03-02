import { createController } from '../../../helpers/controller-test-helpers';
import { FinancialController } from '@/interface/modules/financial/financial.controller';

describe('FinancialController', () => {
  const trackFinancialRecordService = {
    list: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  };
  const financialNetCleanService = {
    fillNetValue: jest.fn(),
  };
  const financialCleanService = {
    cleanFinancialValueTrend: jest.fn(),
  };
  const financialValueSummaryService = {
    getFinancialSummary: jest.fn(),
  };
  const financialAnalyzeService = {
    getFinancialDetail: jest.fn(),
  };

  const controller = createController(FinancialController, {
    trackFinancialRecordService,
    financialNetCleanService,
    financialCleanService,
    financialValueSummaryService,
    financialAnalyzeService,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('list should append summary for each item', async () => {
    const query = { current: 1, pageSize: 10 };
    const list = [
      [
        { id: '1', name: 'A' },
        { id: '2', name: 'B' },
      ],
      2,
    ];
    trackFinancialRecordService.list.mockResolvedValue(list);
    financialValueSummaryService.getFinancialSummary
      .mockResolvedValueOnce({ profit: 1 })
      .mockResolvedValueOnce({ profit: 2 });

    await expect(controller.list(query as never)).resolves.toEqual([
      [
        { id: '1', name: 'A', profit: 1 },
        { id: '2', name: 'B', profit: 2 },
      ],
      2,
    ]);
  });

  it('create/delete/update should call record service', async () => {
    trackFinancialRecordService.create.mockResolvedValue({ id: '1' });
    await expect(controller.create({ name: 'A', code: 'ZH001' } as never)).resolves.toEqual({
      id: '1',
    });

    trackFinancialRecordService.delete.mockResolvedValue({ ok: true });
    await expect(controller.delete({ id: '1' })).resolves.toEqual({ ok: true });

    trackFinancialRecordService.update.mockResolvedValue({ affected: 1 });
    await expect(
      controller.update({ id: '1', name: 'A', code: 'ZH001' } as never)
    ).resolves.toEqual({
      affected: 1,
    });
  });

  it('clean should trigger both clean services', async () => {
    financialNetCleanService.fillNetValue.mockResolvedValue(undefined);
    financialCleanService.cleanFinancialValueTrend.mockResolvedValue(undefined);
    await expect(controller.clean({ code: 'ZH001', from: 1 })).resolves.toBeUndefined();
    expect(financialNetCleanService.fillNetValue).toHaveBeenCalledWith('ZH001', 1);
    expect(financialCleanService.cleanFinancialValueTrend).toHaveBeenCalledWith('ZH001', 1);
  });

  it('getDetail should call analyze service', async () => {
    const query = { id: '1' };
    financialAnalyzeService.getFinancialDetail.mockResolvedValue({ id: '1' });
    await expect(controller.getDetail(query as never)).resolves.toEqual({ id: '1' });
    expect(financialAnalyzeService.getFinancialDetail).toHaveBeenCalledWith(query);
  });

  it('should propagate service errors', async () => {
    trackFinancialRecordService.list.mockRejectedValue(new Error('list failed'));
    await expect(controller.list({} as never)).rejects.toThrow('list failed');
  });
});
