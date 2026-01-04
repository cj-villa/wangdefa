import * as fs from 'fs';
import * as path from 'path';
import { BillEmailVo } from '../../../src/core/firefly';
import type { Attachment } from 'mailparser';

const testFileBuffer = fs.readFileSync(
  path.join(__dirname, '../../../static/支付宝交易明细(20251124-20251224).zip')
);

describe('识别互联网账单', () => {
  it('正确识别支付宝账单', async () => {
    const billEmailVo = new BillEmailVo(
      '\n\n444035\n\n\n\n\n\n\n\n\n-------- 转发邮件信息 --------\n发件人："支付宝提醒" <service@mail.alipay.com>\n发送日期：2025-12-29 16:13:08\n收件人：crlv88@163.com\n主题：陆晨杰的支付宝交易流水明细\n\n亲爱的用户：您好！\n\n支付宝会员 陆晨杰 的交易流水明细已发送到您邮箱，请下载附件查阅。\n\n出于安全考虑，附件已加密，解压密码已通过支付宝服务消息发送至申请人支付宝，请留意相关通知，或在“支付宝 - 我的 - 账单 - 右上角... - 开具交易流水证明 - 申请记录” 中查看。\n\n建议从电脑端下载查阅。如无法解压，请尝试更换解压软件。',
      [
        {
          content: testFileBuffer,
          filename: '支付宝交易明细(20251124-20251224).zip',
        } as Attachment,
      ],
      {
        alipay: {
          dateTime: '交易时间',
          category: '交易分类',
          counterparty: '交易对方',
          counterpartyAccount: '对方账号',
          description: '商品说明',
          direction: '收/支',
          amount: '金额',
          paymentMethod: '收/付款方式',
          status: '交易状态',
          tradeNo: '交易订单号',
          merchantOrderNo: '商家订单号',
          remark: '备注',
        },
      } as any
    );

    const content = await billEmailVo.eBill.decompress();
    expect(content.split('\n')[1].trim()).toBe('导出信息：');

    billEmailVo.eBill.toJSON();
  });
});
