import { createController } from '../../../helpers/controller-test-helpers';
import { FinancialNetValueController } from '@/interface/modules/financial/financial-net-value.controller';

describe('FinancialNetValueController', () => {
  const financialNetCleanService = {
    fillNetValue: jest.fn(),
  };
  const financialNetService = {
    getNetValueList: jest.fn(),
  };
  const controller = createController(FinancialNetValueController, {
    financialNetCleanService,
    financialNetService,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('list should call net value service', async () => {
    const query = { code: 'ZH001', current: 1, pageSize: 10 };
    financialNetService.getNetValueList.mockResolvedValue([[{ id: '1' }], 1]);
    await expect(controller.list(query)).resolves.toEqual([[{ id: '1' }], 1]);
    expect(financialNetService.getNetValueList).toHaveBeenCalledWith(query);
  });

  it('cleanNetValue should clean net value', async () => {
    financialNetCleanService.fillNetValue.mockResolvedValue(undefined);
    await expect(controller.cleanNetValue({ code: 'ZH001', from: 1 })).resolves.toBeUndefined();
    expect(financialNetCleanService.fillNetValue).toHaveBeenCalledWith('ZH001', 1);
  });

  it('should propagate clean failure', async () => {
    financialNetCleanService.fillNetValue.mockRejectedValue(new Error('clean failed'));
    await expect(controller.cleanNetValue({ code: 'ZH001', from: 1 })).rejects.toThrow(
      'clean failed'
    );
  });
});
