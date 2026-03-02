import { FireflyController } from '@/interface/modules/firefly/firefly.controller';

describe('FireflyController', () => {
  const basicInfoService = {
    getBasicInfo: jest.fn(),
  };
  const singleAutomationService = {
    handleCron: jest.fn(),
  };
  const controller = new FireflyController(
    basicInfoService as never,
    singleAutomationService as never
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getBasicInfo should return service result', async () => {
    basicInfoService.getBasicInfo.mockResolvedValue({ default_currency_code: 'CNY' });
    await expect(controller.getBasicInfo()).resolves.toEqual({ default_currency_code: 'CNY' });
  });

  it('runCronManually should return service result', async () => {
    singleAutomationService.handleCron.mockResolvedValue('ok');
    await expect(controller.runCronManually()).resolves.toBe('ok');
  });

  it('should propagate cron failure', async () => {
    singleAutomationService.handleCron.mockRejectedValue(new Error('cron failed'));
    await expect(controller.runCronManually()).rejects.toThrow('cron failed');
  });
});
