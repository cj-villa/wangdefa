import { Body, Controller, Get, Inject, Post, Query, UseInterceptors } from '@nestjs/common';
import { TrackFinancialRecordService } from '@/core/financial/domain/service/track-financial-record.service';
import { PaginationFormatInterceptor } from '@/interface/interceptor/response-format';
import { TrackFinancialQuery } from '@/core/financial/application/query/track-financial.query';
import type { TrackFinancialCreateDto } from '@/core/financial/application/dto/track-financial-create.dto';
import { DeleteDto } from '@/core/common/application/dto/delete.dto';
import { TrackFinancialUpdateDto } from '@/core/financial/application/dto/track-financial-update.dto';
import { FinancialNetValueCleanService } from '@/core/financial/domain/service/financial-net-value-clean.service';
import { TrackFinancialCleanDto } from '@/core/financial/application/dto/track-financial-clean.dto';
import { FinancialValueCleanService } from '@/core/financial/domain/service/financial-value-clean.service';

@Controller('/api/financial')
export class FinancialController {
  @Inject()
  private readonly trackFinancialRecordService: TrackFinancialRecordService;

  @Inject()
  private readonly financialNetCleanService: FinancialNetValueCleanService;

  @Inject()
  private readonly financialCleanService: FinancialValueCleanService;

  @Get('list')
  @UseInterceptors(PaginationFormatInterceptor)
  list(@Query() query: TrackFinancialQuery) {
    return this.trackFinancialRecordService.list(query);
  }

  @Post('create')
  create(@Body() body: TrackFinancialCreateDto) {
    return this.trackFinancialRecordService.create(body);
  }

  @Post('delete')
  delete(@Body() body: DeleteDto) {
    return this.trackFinancialRecordService.delete(body.id);
  }

  @Post('update')
  update(@Body() body: TrackFinancialUpdateDto) {
    return this.trackFinancialRecordService.update(body);
  }

  @Post('clean-net-value')
  async cleanNetValue(@Body() body: TrackFinancialCleanDto) {
    // 清洗基金净值
    await this.financialNetCleanService.fillNetValue(body.code, body.from);
  }

  @Post('clean')
  async clean(@Body() body: TrackFinancialCleanDto) {
    // 清洗基金净值
    await this.financialNetCleanService.fillNetValue(body.code, body.from);
    await this.financialCleanService.cleanFinancialValueTrend(body.code, body.from);
  }
}
