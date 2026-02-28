import { Attachment } from 'mailparser';
import { BillCommand } from '../../application/commands/bill-command';
import { EBillVo } from '@/core/firefly';

export class BillEmailVo {
  readonly eBill: EBillVo;

  constructor(text: string, attachments: Attachment[], transfer?: Record<string, BillCommand>) {
    this.eBill = new EBillVo(text, attachments[0].content, transfer);
  }
}
