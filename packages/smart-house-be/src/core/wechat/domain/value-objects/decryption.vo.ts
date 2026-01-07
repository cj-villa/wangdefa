import type { SubscriptionSecureCommand, WechatMessageDto } from '@/core/wechat';
import * as crypto from 'crypto';

import {xml2Json} from "@/shared/toolkits/transform";

export class SubscriptionDecryptionVO<T extends WechatMessageDto = WechatMessageDto> {
  private _payload?: T;

  constructor(private readonly decryption: SubscriptionSecureCommand) {}

  // 加密情况下进行校验
  private verifyWithSecure() {
    const { token, timestamp, nonce, Encrypt, msgSignature } = this.decryption;
    const compareStr = [token, timestamp, nonce, Encrypt].filter(Boolean).sort().join('');
    return crypto.createHash('sha1').update(compareStr, 'utf8').digest('hex') === msgSignature;
  }

  // 明文情况下进行校验
  private verifyWithPlainText() {
    const { token, timestamp, nonce, signature } = this.decryption;
    const compareStr = [token, timestamp, nonce].filter(Boolean).sort().join('');
    return crypto.createHash('sha1').update(compareStr, 'utf8').digest('hex') === signature;
  }

  // 加密情况下获取数据
  private decryptPayload() {
    const { encodingAESKey, Encrypt } = this.decryption;
    if (!Encrypt) {
      return;
    }
    const aesKey = Buffer.from(`${encodingAESKey}=`, 'base64');
    if (aesKey.length !== 32) {
      return;
    }
    const tmpMsg = Buffer.from(Encrypt, 'base64');
    const decipher = crypto.createDecipheriv('aes-256-cbc', aesKey, aesKey.slice(0, 16));
    decipher.setAutoPadding(true);
    const decryptedBuffer = decipher.update(tmpMsg);
    const randomStr = Uint8Array.prototype.slice.call(decryptedBuffer, 0, 16).toString();
    const msgLength = Uint8Array.prototype.slice.call(decryptedBuffer, 16, 20).readUInt32BE(0);
    const payload = Uint8Array.prototype.slice.call(decryptedBuffer, 20, 20 + msgLength).toString();
    const appId = Uint8Array.prototype.slice.call(decryptedBuffer, 20 + msgLength, 205).toString();
    return xml2Json<{ xml: T }>(payload).then((res) => res?.xml ?? (res as unknown as T));
  }

  async getPayload() {
    if (this._payload) {
      return this._payload;
    }
    const payload = await this.decryptPayload().then((res) => {
      this._payload = res;
      return res;
    });
    return payload;
  }

  verify(): boolean {
    if (this.decryption.Encrypt) {
      return this.verifyWithSecure();
    }
    return this.verifyWithPlainText();
  }
}
