import { Body, Controller, Get, Inject, Post, Query, UseInterceptors } from '@nestjs/common';
import { PaginationFormatInterceptor } from '@/interface/interceptor/response-format';
import { DeleteDto } from '@/core/common/application/dto/delete.dto';
import { TrackFundTransactionService } from '@/core/financial/domain/service/track-fund-transaction.service';
import type { TrackFundTransactionQuery } from '@/core/financial/application/query/track-fund-transaction.query';
import type { TrackFundTransactionCreateDto } from '@/core/financial/application/dto/track-fund-transaction-create.dto';
import type { TrackFundTransactionUpdateDto } from '@/core/financial/application/dto/track-fund-transaction-update.dto';

@Controller('/api/fund/transaction')
export class FundTransactionController {
  @Inject()
  private readonly trackFundTransactionService: TrackFundTransactionService;

  @Get('list')
  @UseInterceptors(PaginationFormatInterceptor)
  list(@Query() query: TrackFundTransactionQuery) {
    return this.trackFundTransactionService.list(query);
  }

  @Post('create')
  create(@Body() body: TrackFundTransactionCreateDto) {
    return this.trackFundTransactionService.create(body);
  }

  @Post('delete')
  delete(@Body() body: DeleteDto) {
    return this.trackFundTransactionService.delete(body.id);
  }

  @Post('update')
  update(@Body() body: TrackFundTransactionUpdateDto) {
    return this.trackFundTransactionService.update(body);
  }
}
