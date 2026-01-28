import { Body, Controller, Get, Inject, Post, Query, UseInterceptors } from '@nestjs/common';
import { PaginationFormatInterceptor } from '@/interface/interceptor/response-format';
import { DeleteDto } from '@/core/common/application/dto/delete.dto';
import { TrackFinancialTransactionService } from '@/core/financial/domain/service/track-financial-transaction.service';
import type { TrackFinancialTransactionQuery } from '@/core/financial/application/query/track-financial-transaction.query';
import type { TrackFinancialTransactionCreateDto } from '@/core/financial/application/dto/track-financial-transaction-create.dto';
import type { TrackFinancialTransactionUpdateDto } from '@/core/financial/application/dto/track-financial-transaction-update.dto';

@Controller('/api/financial/transaction')
export class FinancialTransactionController {
  @Inject()
  private readonly trackFinancialTransactionService: TrackFinancialTransactionService;

  @Get('list')
  @UseInterceptors(PaginationFormatInterceptor)
  list(@Query() query: TrackFinancialTransactionQuery) {
    return this.trackFinancialTransactionService.list(query);
  }

  @Post('create')
  create(@Body() body: TrackFinancialTransactionCreateDto) {
    return this.trackFinancialTransactionService.create(body);
  }

  @Post('delete')
  delete(@Body() body: DeleteDto) {
    return this.trackFinancialTransactionService.delete(body.id);
  }

  @Post('update')
  update(@Body() body: TrackFinancialTransactionUpdateDto) {
    return this.trackFinancialTransactionService.update(body);
  }
}
