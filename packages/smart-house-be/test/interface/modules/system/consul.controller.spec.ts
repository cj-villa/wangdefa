import { SystemConfigController } from '@/interface/modules/system/consul.controller';

describe('SystemConfigController', () => {
  const kvService = {
    list: jest.fn(),
    get: jest.fn(),
    update: jest.fn(),
  };
  const controller = new SystemConfigController(kvService as never);
  Object.defineProperty(controller, 'consulConfig', { value: { prefix: 'app' } });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getConfigList should trim prefix and return tuple', async () => {
    kvService.list.mockResolvedValue(['app/db', 'app/cache', 'app/', '']);
    await expect(controller.getConfigList()).resolves.toEqual([['db', 'cache'], 2]);
  });

  it('detail and update should call kv service', async () => {
    kvService.get.mockResolvedValue({ mysql: true });
    await expect(controller.detail('db')).resolves.toEqual({ mysql: true });

    kvService.update.mockResolvedValue({ ok: true });
    await expect(controller.update({ key: 'db', data: { mysql: false } })).resolves.toEqual({
      ok: true,
    });
    expect(kvService.update).toHaveBeenCalledWith('db', { mysql: false });
  });

  it('should propagate kv errors', async () => {
    kvService.get.mockRejectedValue(new Error('kv failed'));
    await expect(controller.detail('db')).rejects.toThrow('kv failed');
  });
});
