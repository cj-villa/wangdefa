import { Attachment } from 'mailparser';
import { EBillVo } from '@/core/firefly';
import { BillCommand } from '../../application/commands/bill-command';

export class BillEmailVo {
  readonly eBill: EBillVo;

  constructor(text: string, attachments: Attachment[], transfer?: Record<string, BillCommand>) {
    this.eBill = new EBillVo(text, attachments[0].content, transfer);
  }
}
