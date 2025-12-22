export class SubscriptionSecureCommand {
  constructor(
    // 服务号token
    public readonly token: string,
    // 时间戳
    public readonly timestamp: string,
    // 随机数
    public readonly nonce: string,
    // 非加密情况下的签名
    public readonly signature: string,
    // 加密数据
    readonly Encrypt: string,
    // 加密类型
    readonly encryptType: string,
    // 消息签名
    readonly msgSignature: string,
    // 加密密钥
    readonly encodingAESKey: string
  ) {}
}
