import { Controller, Get } from '@nestjs/common';
import { Kv, KvService } from '@/infrastructure/consul';

@Controller('user')
export class UserController {
  constructor(private consulKvService: KvService) {}

  @Kv('test')
  testKey: string;

  @Get()
  findAll() {
    return this.testKey;
    // return this.consulKvService.read('test');
  }
}
