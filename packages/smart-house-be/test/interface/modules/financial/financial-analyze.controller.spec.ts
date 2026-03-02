import { createController } from '../../../helpers/controller-test-helpers';
import { FinancialAnalyzeController } from '@/interface/modules/financial/financial-analyze.controller';

describe('FinancialAnalyzeController', () => {
  const financialDetailService = {
    getSummary: jest.fn(),
  };
  const controller = createController(FinancialAnalyzeController, { financialDetailService });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getSummary should return summary data', async () => {
    financialDetailService.getSummary.mockResolvedValue({ amount: 100 });
    await expect(controller.getSummary()).resolves.toEqual({ amount: 100 });
  });

  it('should propagate service error', async () => {
    financialDetailService.getSummary.mockRejectedValue(new Error('summary failed'));
    await expect(controller.getSummary()).rejects.toThrow('summary failed');
  });
});
