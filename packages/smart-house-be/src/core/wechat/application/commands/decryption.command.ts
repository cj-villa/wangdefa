import type {
  SubscriptionDecryptionRequestBodyDto,
  SubscriptionDecryptionRequestQueryDto,
} from '@/core/wechat';

export class SubscriptionDecryptionCommand {
  constructor(
    // 服务号token
    public readonly token: string,
    // 时间戳
    public readonly timestamp: string,
    // 随机数
    public readonly nonce: string,
    // 签名
    public readonly signature: string,
    /** 仅加密传输的情况下会返回以下数据 */
    public readonly encrypt?: {
      // 加密数据
      readonly Encrypt: string;
      // 加密类型
      readonly encryptType: string;
      // 消息签名
      readonly msgSignature: string;
      // 加密密钥
      readonly encodingAESKey: string;
    }
  ) {}

  static fromDto(
    body: SubscriptionDecryptionRequestBodyDto,
    query: SubscriptionDecryptionRequestQueryDto,
    token: string,
    encodingAESKey: string
  ) {
    return new SubscriptionDecryptionCommand(
      token,
      query.timestamp,
      query.nonce,
      query.signature,
      body.Encrypt && {
        Encrypt: body.Encrypt,
        encryptType: query.encrypt_type,
        msgSignature: query.msg_signature,
        encodingAESKey,
      }
    );
  }
}

export class SubscriptionPayloadCommand {
  constructor(
    /** 接收方账号（收到消息时为公众账号，发送消息时为接收方账号） */
    public readonly ToUserName: string,
    /** 发送方账号（收到消息时为发送方账号，发送消息时为公众账号） */
    public readonly FromUserName: string,
    /** 创建时间（时间戳） */
    public readonly CreateTime: number,
    /** 消息类型 */
    public readonly MsgType: string,
    /** 事件类型 */
    public readonly Event: string,
    // 调试用字符串
    public readonly debug_str: string
  ) {}

  static fromDto(
    body: SubscriptionDecryptionRequestBodyDto
  ): SubscriptionPayloadCommand | undefined {
    if (!body.Encrypt) {
      return undefined;
    }
    return new SubscriptionPayloadCommand(
      body.ToUserName,
      body.FromUserName,
      body.CreateTime,
      body.MsgType,
      body.Event,
      body.debug_str
    );
  }
}
