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
import { FinancialValueSummaryService } from '@/core/financial/domain/service/financial-value-summary.service';
// 导入新增的服务和查询
import { FinancialAnalyzeService } from '@/core/financial/domain/service/financial-analyze.service';
import { FinancialDetailQuery } from '@/core/financial/application/query/financial-detail.query';

@Controller('/api/financial')
export class FinancialController {
  @Inject()
  private readonly trackFinancialRecordService: TrackFinancialRecordService;

  @Inject()
  private readonly financialNetCleanService: FinancialNetValueCleanService;

  @Inject()
  private readonly financialCleanService: FinancialValueCleanService;

  @Inject()
  private readonly financialValueSummaryService: FinancialValueSummaryService;

  @Inject()
  private readonly financialAnalyzeService: FinancialAnalyzeService;

  @Get('list')
  @UseInterceptors(PaginationFormatInterceptor)
  async list(@Query() query: TrackFinancialQuery) {
    const list = await this.trackFinancialRecordService.list(query);
    for (const financial of list[0]) {
      const summary = await this.financialValueSummaryService.getFinancialSummary(financial.id);
      Object.assign(financial, summary);
    }
    return list;
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

  @Post('clean')
  async clean(@Body() body: TrackFinancialCleanDto) {
    // 清洗基金净值
    await this.financialNetCleanService.fillNetValue(body.code, body.from);
    await this.financialCleanService.cleanFinancialValueTrend(body.code, body.from);
  }

  @Get('detail')
  async getDetail(@Query() query: FinancialDetailQuery) {
    return this.financialAnalyzeService.getFinancialDetail(query);
  }
}