import { ImapFlow, type MailboxLockObject, type ImapFlowOptions } from 'imapflow';
import { simpleParser } from 'mailparser';
import EventEmitter from 'events';
import { createLogger } from '@/shared/logger';

export class Imap extends EventEmitter {
  private logger = createLogger(Imap.name);
  private client: ImapFlow;

  private connected = false;
  private mailLock?: MailboxLockObject;

  constructor(private readonly config: ImapFlowOptions) {
    super();
  }

  async logout() {
    await this.client.logout();
  }

  async connect() {
    await this._connect();
    await this._listening();
    await this.heartbeat();
  }

  private async _connect() {
    if (this.connected) {
      return;
    }
    const client = new ImapFlow(this.config);
    this.client = client;
    await client.connect();
    this.connected = true;
  }

  private async _reConnect() {
    this.connected = false;
    this.client = undefined;
    this.mailLock?.release();
    await this._connect();
  }

  private async _listening() {
    const { client } = this;
    this.mailLock = await client.getMailboxLock('INBOX');
    try {
      this.logger.debug('正在监听新邮件...');
      client.on('exists', async (data) => {
        this.logger.info(`检测到新邮件！当前文件夹总数: ${data.count}`);
        try {
          for await (let msg of client.fetch({ seen: false }, { source: true })) {
            client.messageFlagsAdd(msg.uid, ['\\Seen'], { uid: true });
            let data = await simpleParser(msg.source);
            this.emit('message', data);
          }
        } catch (err) {
          this.logger.error('获取新邮件详情失败:', err);
        }
      });
    } catch (err) {
      this.logger.error('监听程序启动失败，10秒后重试:', err.message);
      setTimeout(() => {
        this._listening();
      }, 10000);
    }

    client.on('close', () => {
      this.logger.warn('⚠️ IMAP 连接已关闭，正在尝试重连...');
      this._reConnect().then(() => {
        this._listening();
      });
    });
  }

  async heartbeat() {
    try {
      while (true) {
        this.logger.debug('发送 NOOP 命令...');
        await this.client.noop();
        await new Promise((resolve) => setTimeout(resolve, 60000)); // 维持进程不退出
      }
    } catch (err) {
      this.logger.debug(`停止监听邮件服务... ${err.message}`);
      this.mailLock?.release();
    }
  }
}
