export abstract class BaseMessageDto {
  /** 公众号原始ID */
  ToUserName!: string;

  /** 用户 OpenID */
  FromUserName!: string;

  /** 创建时间（秒级时间戳） */
  CreateTime!: number;

  /** 消息类型 */
  MsgType!: 'text' | 'image' | 'voice' | 'event';
}

export class TextMessageDto extends BaseMessageDto {
  MsgType!: 'text';

  /** 文本内容 */
  Content!: string;

  /** 消息 ID（注意：要用 string） */
  MsgId!: string;
}

export class ImageMessageDto extends BaseMessageDto {
  MsgType!: 'image';

  /** 图片链接 */
  PicUrl!: string;

  /** 图片媒体 ID */
  MediaId!: string;

  /** 消息 ID */
  MsgId!: string;
}

export class VoiceMessageDto extends BaseMessageDto {
  MsgType!: 'voice';

  /** 语音媒体 ID */
  MediaId!: string;

  /** 语音格式 */
  Format!: string;

  /** 语音识别结果（可选） */
  Recognition?: string;

  /** 消息 ID */
  MsgId!: string;
}

export class EventMessageDto extends BaseMessageDto {
  MsgType!: 'event';

  /** 事件类型 */
  Event!: string;

  /** 事件 Key（可选） */
  EventKey?: string;
}

export type WechatMessageDto = TextMessageDto | ImageMessageDto | VoiceMessageDto | EventMessageDto;
