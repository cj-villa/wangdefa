import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { MAIL_INSTANCE } from '@/infrastructure/mail/constant';
import { Imap } from '@/infrastructure/mail/libs/Imap';

@Injectable()
export class MailBaseService implements OnModuleInit, OnModuleDestroy {
  constructor(@Inject(MAIL_INSTANCE) private readonly imap: Imap) {}

  onModuleDestroy() {
    this.imap?.logout();
  }

  onModuleInit() {
    this.imap?.connect();
  }
}
