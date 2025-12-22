import { IsNumberString, IsString } from 'class-validator';

/** 服务号加密query参数 */
export class SubscriptionDecryptionRequestQueryDto {
  /** 时间戳 */
  @IsNumberString()
  timestamp: string;
  /** 随机数 */
  @IsString()
  nonce: string;

  @IsString()
  echostr: string;

  /** 发送方openid */
  @IsString()
  openid?: string;

  /** 加密类型 */
  @IsString()
  encrypt_type: string;

  /** 消息签名 */
  @IsString()
  msg_signature: string;

  /** 非加密消息签名 */
  @IsString()
  signature?: string;
}

/** 服务号加密body参数 */
export class SubscriptionDecryptionRequestBodyDto {
  @IsString()
  ToUserName: string;

  @IsString()
  FromUserName?: string;

  @IsNumberString()
  CreateTime?: number;

  @IsString()
  MsgType?: string;

  @IsString()
  Event?: string;

  @IsString()
  Content?: string;

  @IsNumberString()
  MsgId?: number;

  @IsString()
  MsgDataId?: string;

  @IsString()
  debug_str?: string;

  @IsString()
  Encrypt?: string;
}
