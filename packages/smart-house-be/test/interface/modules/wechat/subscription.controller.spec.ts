import { createController } from '../../../helpers/controller-test-helpers';
import { SubscriptionController } from '@/interface/modules/wechat/subscription.controller';

describe('SubscriptionController', () => {
  const subscriptionService = {
    onMessage: jest.fn(),
  };
  const controller = createController(SubscriptionController, { subscriptionService });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('verify should return echostr from query', () => {
    expect(controller.verify({ echostr: 'ok' } as never)).toBe('ok');
  });

  it('onMessage should call subscription service', async () => {
    subscriptionService.onMessage.mockResolvedValue('success');
    await expect(controller.onMessage({ MsgType: 'text' } as never)).resolves.toBe('success');
    expect(subscriptionService.onMessage).toHaveBeenCalledWith({ MsgType: 'text' });
  });

  it('test should echo query', async () => {
    const query = { foo: 'bar' };
    await expect(controller.test(query)).resolves.toEqual({ query });
  });

  it('should propagate service error', async () => {
    subscriptionService.onMessage.mockRejectedValue(new Error('wechat failed'));
    await expect(controller.onMessage({} as never)).rejects.toThrow('wechat failed');
  });
});
