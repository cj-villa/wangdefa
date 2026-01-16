import AdmZip from 'adm-zip';
import iconv from 'iconv-lite';
import { BillCommand } from '../../application/commands/bill-command';

// 账单内容识别vo
export class EBillVo {
  constructor(
    /** 邮件内容 */
    private readonly text: string,
    /** 邮件附件 */
    private readonly zip: Buffer,
    private readonly channelTransfer?: Record<string, BillCommand>
  ) {}

  private _content: string;

  // 账单的渠道
  private get channel(): string {
    if (this.text.includes('service@mail.alipay.com')) {
      return 'alipay';
    }
    return 'default';
  }

  // 不同渠道有不同的编码格式
  private get encoding(): string {
    switch (this.channel) {
      case 'alipay':
        return 'gbk';
      default:
        return 'utf-8';
    }
  }

  /** 将邮件内容中的第一行字作为密码 */
  private get password(): string {
    return this.text.split('\n').find(Boolean);
  }

  private get transfer() {
    return this.channelTransfer?.[this.channel];
  }

  // 解压文本并缓存
  decompress(): string {
    const zip = new AdmZip(this.zip);
    // 定义有问题，可以传入密码
    const [zipEntry]: AdmZip.IZipEntry[] = zip.getEntries();
    // 正常只有一个文件，解压后缓存内容
    this._content = iconv.decode((zipEntry as any).getData(this.password) as Buffer, this.encoding);
    return this._content;
  }

  get content(): string {
    if (!this._content) {
      this.decompress();
    }
    return this._content;
  }

  getHeaderIndex(rows: string[]) {
    return (
      rows.findIndex((row) => {
        if (this.channel === 'alipay') {
          return row.includes('电子客户回单');
        }
        return -1;
      }) + 1
    );
  }

  private transform(item: Record<string, string>): BillCommand {
    if (!this.transfer) {
      throw new Error('Transfer not implemented');
    }
    return Object.keys(this.transfer).reduce<BillCommand>((billCommand, key) => {
      billCommand[key] = item[this.transfer[key]];
      return billCommand;
    }, {} as BillCommand);
  }

  private filter(list: BillCommand[]) {
    return list.reduce<BillCommand[]>((billList, item) => {
      if (!item.tradeNo) {
        return billList;
      }
      switch (this.channel) {
        case 'alipay':
          // TODO 反选非
          if (!item.paymentMethod?.includes('余额')) {
            item.direction === '支出' && (item.paymentMethod = '支付宝余额');
            billList.push(item);
          }
          break;
      }
      return billList;
    }, []);
  }

  toJSON() {
    const rows = this.content.split(/\r\n|\n/);
    const headerIndex = this.getHeaderIndex(rows);
    const headers = rows[headerIndex].split(',').filter(Boolean);
    const list: BillCommand[] = [];
    rows.slice(headerIndex + 1).forEach((row) => {
      const item = {};
      const cells = row.split(',');
      headers.forEach((header, index) => {
        item[header] = cells[index]?.trim();
      });
      list.push(this.transform(item));
    });
    return this.filter(list);
  }
}
