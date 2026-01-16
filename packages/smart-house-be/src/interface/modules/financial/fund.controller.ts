import { Body, Controller, Get, Inject, Post, Query, UseInterceptors } from '@nestjs/common';
import { TrackFundRecordService } from '@/core/financial/domain/service/track-fund-record.service';
import { PaginationFormatInterceptor } from '@/interface/interceptor/response-format';
import { TrackFundQuery } from '@/core/financial/application/query/track-fund.query';
import type { TrackFundCreateDto } from '@/core/financial/application/dto/track-fund-create.dto';
import { DeleteDto } from '@/core/common/application/dto/delete.dto';
import { TrackFundUpdateDto } from '@/core/financial/application/dto/track-fund-update.dto';

@Controller('/api/fund')
export class FundController {
  @Inject()
  private readonly trackFundRecordService: TrackFundRecordService;

  @Get('list')
  @UseInterceptors(PaginationFormatInterceptor)
  list(@Query() query: TrackFundQuery) {
    return this.trackFundRecordService.list(query);
  }

  @Post('create')
  create(@Body() body: TrackFundCreateDto) {
    return this.trackFundRecordService.create(body);
  }

  @Post('delete')
  delete(@Body() body: DeleteDto) {
    return this.trackFundRecordService.delete(body.id);
  }

  @Post('update')
  update(@Body() body: TrackFundUpdateDto) {
    return this.trackFundRecordService.update(body);
  }
}
