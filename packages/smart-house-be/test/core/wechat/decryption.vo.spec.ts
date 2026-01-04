import { SubscriptionDecryptionVO } from '../../../src/core/wechat';

const payload = {
  ToUserName: 'gh_ca84f3bdb091',
  FromUserName: 'oHaAL0nVM9N5NtUn3yw9wtnJ6Qto',
  CreateTime: '1766130891',
  MsgType: 'event',
  Event: 'debug_demo',
  debug_str: '',
};

describe('DecryptionVO', () => {
  describe('检验', () => {
    it('正确的加密的请求可以通过', async () => {
      const decryptionVO = new SubscriptionDecryptionVO({
        token: 'token',
        timestamp: '1766994826',
        nonce: '744667351',
        signature: 'bf972a8c2000eb435ea8b73493fbeaa4c65f4709',
        Encrypt:
          'JzQxqYI3rdy1UVZxA+9+caY3s+pKn6aChNuaVi+cyoDMtdIN2GOy1DfF575xGiq/RrNuLMZm23CEr9mP1PDsvE2iK56S0kWShiGTI05Htx+xGvDqZu2HJ11H6iZ8j0Z1uyisr0GwNOHs7rdHDC0qTGLvp8eQnDVfLCITHg397GT+KrDWZwKi3lA231BMEBwR0SWHeds0Wjxml/KM2IeJKAIgYVIIxtXMp6chQuAaKn7DAr9wMlWXAcptuJvxUs548GEehLSlUPojHD2z+He/B91/sUkzGYoFqko6AFJOrOc=',
        msgSignature: '6c240401213479539ffa84391de588db37a3a950',
        encryptType: 'aes',
        encodingAESKey: 'ttVCbg3lD8s0S2dqnlIt37JYlpc6TnbzOwTw6hh6nv6',
      });
      expect(decryptionVO.verify()).toBe(true);
    });

    it('异常的加密的请求可以拒绝', async () => {
      const decryptionVO = new SubscriptionDecryptionVO({
        token: 'token2',
        timestamp: '1766994826',
        nonce: '744667351',
        signature: 'bf972a8c2000eb435ea8b73493fbeaa4c65f4709',
        Encrypt:
          'JzQxqYI3rdy1UVZxA+9+caY3s+pKn6aChNuaVi+cyoDMtdIN2GOy1DfF575xGiq/RrNuLMZm23CEr9mP1PDsvE2iK56S0kWShiGTI05Htx+xGvDqZu2HJ11H6iZ8j0Z1uyisr0GwNOHs7rdHDC0qTGLvp8eQnDVfLCITHg397GT+KrDWZwKi3lA231BMEBwR0SWHeds0Wjxml/KM2IeJKAIgYVIIxtXMp6chQuAaKn7DAr9wMlWXAcptuJvxUs548GEehLSlUPojHD2z+He/B91/sUkzGYoFqko6AFJOrOc=',
        msgSignature: '6c240401213479539ffa84391de588db37a3a950',
        encryptType: 'aes',
        encodingAESKey: 'ttVCbg3lD8s0S2dqnlIt37JYlpc6TnbzOwTw6hh6nv6',
      });
      expect(decryptionVO.verify()).toBe(false);
    });
  });

  describe('获得请求体', () => {
    it('获得加密的请求体F', async () => {
      const decryptionVO = new SubscriptionDecryptionVO({
        token: 'token',
        timestamp: '1766130891',
        nonce: '1618154269',
        signature: '50488dd902246209afb0ed5b3b39192423e0d4ba',
        Encrypt:
          'J7MvThhReRa9p2XvWjhAzd4/yN2UryfqgYlOA6Sa8aduDEWDi7nI74qOBeYr/U0+dVFzd5YiVRyq+ggR9Zo1b6NFXPNWmm0EaY5lhCMlvArcVb6x2hqQQqZlitiu4VZElrAqJIh3MXl7hRD8D5GfbalR8Kz1zaczGPHm+bFgKWBwI9Bggi9uwJwWDSjW0vqkeIQwTYZuHrmDGgilJv1AYy/xpf7w0pcScLQGyQ6paiW2bbb31OCzvzuIjBmf/6xFpmod8VVIBdZu3pXgW+MNcdTZrMiq/CIzGv6GWB70y9g0p0OLRDm2Bhwb9SOGyc+32pEN5aUD/6bvfQlKnvtnf5SdZk9bgSTyv9/BMj3wBKgGOwrTGzyEDCkYNmsJ9JqRaDLATSEQcNcWFM1ApuYPfAo6LU5niwjszRcLyVfja+aN8f3prOOjAjlZpMYpYC9yx8XYGXTrLp5+0dmR7L0INQ==',
        msgSignature: '58622a91cb20597b137beb0c64fb604d3929d487',
        encryptType: 'aes',
        encodingAESKey: 'ttVCbg3lD8s0S2dqnlIt37JYlpc6TnbzOwTw6hh6nv6',
      });
      expect(JSON.stringify(await decryptionVO.getPayload())).toBe(JSON.stringify(payload));
    });
  });
});
