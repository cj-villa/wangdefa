import { createController } from '../../../helpers/controller-test-helpers';
import { TokenController } from '@/interface/modules/system/token/token.controller';

describe('TokenController', () => {
  const tokenManageService = {
    create: jest.fn(),
    delete: jest.fn(),
  };
  const tokenSearchService = {
    list: jest.fn(),
  };
  const controller = createController(TokenController, {
    tokenManageService,
    tokenSearchService,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('list should call search service', async () => {
    tokenSearchService.list.mockResolvedValue([[{ id: 't1' }], 1]);
    await expect(controller.list(1, 10)).resolves.toEqual([[{ id: 't1' }], 1]);
  });

  it('create and delete should call manage service', async () => {
    tokenManageService.create.mockResolvedValue({ id: 't1' });
    await expect(controller.create({ name: 'ci-token' })).resolves.toEqual({ id: 't1' });

    tokenManageService.delete.mockResolvedValue({ ok: true });
    await expect(controller.delete({ id: 't1' })).resolves.toEqual({ ok: true });
    expect(tokenManageService.delete).toHaveBeenCalledWith('t1');
  });

  it('should propagate service errors', async () => {
    tokenManageService.create.mockRejectedValue(new Error('create failed'));
    await expect(controller.create({ name: 'bad' })).rejects.toThrow('create failed');
  });
});
