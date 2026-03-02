import { createController } from '../../../helpers/controller-test-helpers';
import { FinancialTransactionController } from '@/interface/modules/financial/financial-transaction.controller';

describe('FinancialTransactionController', () => {
  const trackFinancialTransactionService = {
    list: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  };
  const controller = createController(FinancialTransactionController, {
    trackFinancialTransactionService,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('list should call service', async () => {
    const query = { financialId: 'f1', current: 1, pageSize: 20 };
    trackFinancialTransactionService.list.mockResolvedValue([[{ id: 't1' }], 1]);
    await expect(controller.list(query)).resolves.toEqual([[{ id: 't1' }], 1]);
    expect(trackFinancialTransactionService.list).toHaveBeenCalledWith(query);
  });

  it('create should call service', async () => {
    const body = {
      financialId: 'f1',
      transactionType: 'BUY',
      amount: '10.00',
      transactionDate: '2024-01-01T00:00:00.000Z',
      ensureDate: '2024-01-02T00:00:00.000Z',
    };
    trackFinancialTransactionService.create.mockResolvedValue({ id: 't1' });
    await expect(controller.create(body as never)).resolves.toEqual({ id: 't1' });
    expect(trackFinancialTransactionService.create).toHaveBeenCalledWith(body);
  });

  it('delete should call service', async () => {
    trackFinancialTransactionService.delete.mockResolvedValue({ success: true });
    await expect(controller.delete({ id: 't1' })).resolves.toEqual({ success: true });
    expect(trackFinancialTransactionService.delete).toHaveBeenCalledWith('t1');
  });

  it('update should call service', async () => {
    const body = { id: 't1', amount: '99.00' };
    trackFinancialTransactionService.update.mockResolvedValue({ affected: 1 });
    await expect(controller.update(body as never)).resolves.toEqual({ affected: 1 });
    expect(trackFinancialTransactionService.update).toHaveBeenCalledWith(body);
  });

  it('should propagate service failure', async () => {
    trackFinancialTransactionService.create.mockRejectedValue(new Error('create failed'));
    await expect(
      controller.create({
        financialId: 'f1',
        transactionType: 'BUY',
        amount: '10.00',
        transactionDate: '2024-01-01T00:00:00.000Z',
        ensureDate: '2024-01-02T00:00:00.000Z',
      } as never)
    ).rejects.toThrow('create failed');
  });
});
