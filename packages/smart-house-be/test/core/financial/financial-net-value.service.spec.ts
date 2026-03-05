import { BadRequestException } from '@nestjs/common';
import { FinancialNetValueService } from '@/core/financial/domain/service/financial-net-value.serivce';

describe('FinancialNetValueService', () => {
  const financialNetValueTrendEntity = {
    find: jest.fn(),
  };

  const service = new FinancialNetValueService();

  beforeEach(() => {
    jest.clearAllMocks();
    (service as any).financialNetValueTrendEntity = financialNetValueTrendEntity;
  });

  it('should resolve net value by existing-day offset when calendar day is missing', async () => {
    const trendD1 = { id: '1', date: new Date('2024-01-04T00:00:00.000Z') };
    const trendD3 = { id: '2', date: new Date('2024-01-02T00:00:00.000Z') };
    financialNetValueTrendEntity.find.mockResolvedValue([trendD1, trendD3]);

    const trend = await service.getFinancialNetValueTrendByExistingDays(
      { code: '000001' } as any,
      new Date('2024-01-05T00:00:00.000Z'),
      1
    );

    expect(financialNetValueTrendEntity.find).toHaveBeenCalledTimes(1);
    expect(trend).toBe(trendD3);
  });

  it('should throw when existing net-value history is insufficient', async () => {
    financialNetValueTrendEntity.find.mockResolvedValue([]);

    await expect(
      service.getFinancialNetValueTrendByExistingDays(
        { code: '000001' } as any,
        new Date('2024-01-05T00:00:00.000Z'),
        2
      )
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
