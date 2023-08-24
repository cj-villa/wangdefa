import { RegisterDTO } from '@l/shared';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { UnAuth } from '@/decorator/unAuth';
import { AccountService } from './service';

@Controller('api/account')
@UnAuth()
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Post()
  registry(@Body() user: RegisterDTO) {
    return this.accountService.registry(user);
  }

  @Get()
  test() {
    return 'test';
  }
}
