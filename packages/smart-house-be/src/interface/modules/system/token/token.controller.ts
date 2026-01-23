import { Body, Controller, Get, Inject, Post, Query, UseInterceptors } from '@nestjs/common';
import {
  CreateTokenDto,
  TokenDeleteDto,
  TokenManageService,
  TokenSearchService,
} from '@/core/token';
import { PaginationFormatInterceptor } from '@/interface/interceptor/response-format';

@Controller('/api/system')
export class TokenController {
  @Inject()
  private readonly tokenManageService: TokenManageService;

  @Inject()
  private readonly tokenSearchService: TokenSearchService;

  @Get('list')
  @UseInterceptors(PaginationFormatInterceptor)
  list(@Query('current') current: number, @Query('pageSize') pageSize: number) {
    return this.tokenSearchService.list(current, pageSize);
  }

  @Post('create')
  create(@Body() body: CreateTokenDto) {
    return this.tokenManageService.create(body.name);
  }

  @Post('delete')
  delete(@Body() body: TokenDeleteDto) {
    return this.tokenManageService.delete(body.id);
  }
}
