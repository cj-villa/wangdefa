import { SubscriptionDecryptionVO } from '../../../src/core/wechat';

const payload = {
  ToUserName: 'gh_ca84f3bdb091',
  FromUserName: 'oHaAL0nVM9N5NtUn3yw9wtnJ6Qto',
  CreateTime: 1766130891,
  MsgType: 'event',
  Event: 'debug_demo',
  debug_str: '',
};

describe('DecryptionVO', () => {
  describe('检验', () => {
    it('正确的未加密的请求可以通过', async () => {
      const decryptionVO = new SubscriptionDecryptionVO({
        token: 'token',
        timestamp: '1766130351',
        nonce: '738547932',
        signature: '50488dd902246209afb0ed5b3b39192423e0d4ba',
      });
      expect(decryptionVO.verify()).toBe(true);
    });

    it('异常的未加密的请求可以拒绝', async () => {
      const decryptionVO = new SubscriptionDecryptionVO({
        token: 'token2',
        timestamp: '1766130351',
        nonce: '738547932',
        signature: '50488dd902246209afb0ed5b3b39192423e0d4ba',
      });
      expect(decryptionVO.verify()).toBe(false);
    });

    it('正确的加密的请求可以通过', async () => {
      const decryptionVO = new SubscriptionDecryptionVO({
        token: 'token',
        timestamp: '1766130891',
        nonce: '1618154269',
        signature: '50488dd902246209afb0ed5b3b39192423e0d4ba',
        encrypt: {
          Encrypt:
            'gm/U47yAtqY4/Tixa7+q4VCaPUljAr8g8NvK6itQzyMIio44Lul5FBX+B7n+ciUgc+Kzhe3R54G22ZPsZkibUhA8scXgRLFqQQUOKsmlOubUYT3bQRz8vchq+/dS9HDOS60e3v16rK56gJ9maX7Mj0a/R6/bn+1wvd/CGN4dgL5C1k9M8nDEslmmLN7ApzVcrc9bZZnLJpphywFUw63p7VlAIXlXWXlOOrO84LI+VoW2KK90WPzWNyoMzP15uXKFL9U5ox+MhJPdbSZqgRUExU4+np2ZrYYRkvZj+BQdW0c=',
          msgSignature: 'b192920a5fbf229e8b6d089565a17ec1d785eed9',
          encryptType: 'aes',
          encodingAESKey: 'ttVCbg3lD8s0S2dqnlIt37JYlpc6TnbzOwTw6hh6nv6',
        },
      });
      expect(decryptionVO.verify()).toBe(true);
    });

    it('异常的加密的请求可以拒绝', async () => {
      const decryptionVO = new SubscriptionDecryptionVO({
        token: 'token2',
        timestamp: '1766130891',
        nonce: '1618154269',
        signature: '50488dd902246209afb0ed5b3b39192423e0d4ba',
        encrypt: {
          Encrypt:
            'gm/U47yAtqY4/Tixa7+q4VCaPUljAr8g8NvK6itQzyMIio44Lul5FBX+B7n+ciUgc+Kzhe3R54G22ZPsZkibUhA8scXgRLFqQQUOKsmlOubUYT3bQRz8vchq+/dS9HDOS60e3v16rK56gJ9maX7Mj0a/R6/bn+1wvd/CGN4dgL5C1k9M8nDEslmmLN7ApzVcrc9bZZnLJpphywFUw63p7VlAIXlXWXlOOrO84LI+VoW2KK90WPzWNyoMzP15uXKFL9U5ox+MhJPdbSZqgRUExU4+np2ZrYYRkvZj+BQdW0c=',
          msgSignature: 'b192920a5fbf229e8b6d089565a17ec1d785eed9',
          encryptType: 'aes',
          encodingAESKey: 'ttVCbg3lD8s0S2dqnlIt37JYlpc6TnbzOwTw6hh6nv6',
        },
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
        encrypt: {
          Encrypt:
            'gm/U47yAtqY4/Tixa7+q4VCaPUljAr8g8NvK6itQzyMIio44Lul5FBX+B7n+ciUgc+Kzhe3R54G22ZPsZkibUhA8scXgRLFqQQUOKsmlOubUYT3bQRz8vchq+/dS9HDOS60e3v16rK56gJ9maX7Mj0a/R6/bn+1wvd/CGN4dgL5C1k9M8nDEslmmLN7ApzVcrc9bZZnLJpphywFUw63p7VlAIXlXWXlOOrO84LI+VoW2KK90WPzWNyoMzP15uXKFL9U5ox+MhJPdbSZqgRUExU4+np2ZrYYRkvZj+BQdW0c=',
          msgSignature: 'b192920a5fbf229e8b6d089565a17ec1d785eed9',
          encryptType: 'aes',
          encodingAESKey: 'ttVCbg3lD8s0S2dqnlIt37JYlpc6TnbzOwTw6hh6nv6',
        },
      });
      expect(JSON.stringify(decryptionVO.payload)).toBe(JSON.stringify(payload));
    });

    it('获得未加密的请求体F', async () => {
      const decryptionVO = new SubscriptionDecryptionVO(
        {
          token: 'token',
          timestamp: '1766130891',
          nonce: '1618154269',
          signature: '50488dd902246209afb0ed5b3b39192423e0d4ba',
        },
        payload
      );
      expect(JSON.stringify(decryptionVO.payload)).toBe(JSON.stringify(payload));
    });
  });
});
