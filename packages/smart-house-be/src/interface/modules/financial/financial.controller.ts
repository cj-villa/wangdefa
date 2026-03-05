import { Body, Controller, Get, Inject, Post, Query, UseInterceptors } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { DeleteDto } from '@/core/common/application/dto/delete.dto';
import { RunScheduleManualDto } from '@/core/financial/application/dto/run-schedule-manual.dto';
import { TrackFinancialCleanDto } from '@/core/financial/application/dto/track-financial-clean.dto';
import { TrackFinancialCreateDto } from '@/core/financial/application/dto/track-financial-create.dto';
import { TrackFinancialUpdateDto } from '@/core/financial/application/dto/track-financial-update.dto';
import { FinancialDetailQuery } from '@/core/financial/application/query/financial-detail.query';
import { TrackFinancialQuery } from '@/core/financial/application/query/track-financial.query';
import { FinancialAnalyzeService } from '@/core/financial/domain/service/financial-analyze.service';
import { FinancialNetValueCleanService } from '@/core/financial/domain/service/financial-net-value-clean.service';
import { FinancialValueCleanService } from '@/core/financial/domain/service/financial-value-clean.service';
import { FinancialValueSummaryService } from '@/core/financial/domain/service/financial-value-summary.service';
import { FinancialScheduleService } from '@/core/financial/domain/service/financial.schedule.service';
import { TrackFinancialRecordService } from '@/core/financial/domain/service/track-financial-record.service';
import { PaginationFormatInterceptor } from '@/interface/interceptor/response-format';

@ApiTags('financial')
@ApiBearerAuth()
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

  @Inject()
  private readonly financialScheduleService: FinancialScheduleService;

  @Get('list')
  @ApiOperation({ summary: '查询理财产品列表' })
  @ApiQuery({ name: 'code', required: false, type: String, description: '理财编码' })
  @ApiQuery({ name: 'name', required: false, type: String, description: '理财名称' })
  @ApiQuery({ name: 'current', required: false, type: Number, description: '页码' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, description: '分页大小' })
  @ApiOkResponse({
    description: '理财产品列表查询成功',
    schema: {
      type: 'object',
      properties: {
        data: { type: 'array', items: { type: 'object', additionalProperties: true } },
        total: { type: 'number' },
        success: { type: 'boolean' },
      },
    },
  })
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
  @ApiOperation({ summary: '创建理财产品' })
  @ApiBody({ type: TrackFinancialCreateDto })
  @ApiOkResponse({
    description: '理财产品创建成功',
    schema: { type: 'object', additionalProperties: true },
  })
  create(@Body() body: TrackFinancialCreateDto) {
    return this.trackFinancialRecordService.create(body);
  }

  @Post('delete')
  @ApiOperation({ summary: '删除理财产品' })
  @ApiBody({ type: DeleteDto })
  @ApiOkResponse({
    description: '理财产品删除成功',
    schema: { type: 'object', additionalProperties: true },
  })
  delete(@Body() body: DeleteDto) {
    return this.trackFinancialRecordService.delete(body.id);
  }

  @Post('update')
  @ApiOperation({ summary: '更新理财产品' })
  @ApiBody({ type: TrackFinancialUpdateDto })
  @ApiOkResponse({
    description: '理财产品更新成功',
    schema: { type: 'object', additionalProperties: true },
  })
  update(@Body() body: TrackFinancialUpdateDto) {
    return this.trackFinancialRecordService.update(body);
  }

  @Post('clean')
  @ApiOperation({ summary: '清洗理财趋势数据' })
  @ApiBody({ type: TrackFinancialCleanDto })
  @ApiOkResponse({
    description: '理财趋势数据清洗成功',
    schema: { type: 'object', additionalProperties: true },
  })
  async clean(@Body() body: TrackFinancialCleanDto) {
    // 清洗基金净值
    await this.financialNetCleanService.fillNetValue(body.code, body.from);
    await this.financialCleanService.cleanFinancialValueTrend(body.code, body.from);
  }

  @Get('detail')
  @ApiOperation({ summary: '获取理财产品详情' })
  @ApiQuery({ name: 'id', required: true, type: String, description: '理财ID' })
  @ApiOkResponse({
    description: '理财产品详情查询成功',
    schema: { type: 'object', additionalProperties: true },
  })
  async getDetail(@Query() query: FinancialDetailQuery) {
    return this.financialAnalyzeService.getFinancialDetail(query);
  }

  @Post('run_schedule_manual')
  @ApiOperation({ summary: '手动触发理财定时任务执行' })
  @ApiBody({ type: RunScheduleManualDto, required: false })
  @ApiOkResponse({
    description: '理财定时任务触发成功',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
      },
    },
  })
  async runScheduleManual(@Body() body: RunScheduleManualDto) {
    await this.financialScheduleService.calcFinancialValue(body?.delay, body?.forceRefreshNetValue);
    return { success: true };
  }
}
