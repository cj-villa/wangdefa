import { Injectable } from '@nestjs/common';
import { KvService } from './kv.service';

@Injectable()
export class KvRecordService {
  constructor(private consulKvService: KvService) {}
  // TODO realize
}
