import { Body, Controller, Get, Inject, Post, Query, UseInterceptors } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { TrackFinancialCleanDto } from '@/core/financial/application/dto/track-financial-clean.dto';
import { FinancialNetValueQuery } from '@/core/financial/application/query/financial-net-value.query';
import { FinancialNetValueCleanService } from '@/core/financial/domain/service/financial-net-value-clean.service';
import { FinancialNetValueService } from '@/core/financial/domain/service/financial-net-value.serivce';
import { PaginationFormatInterceptor } from '@/interface/interceptor/response-format';

@ApiTags('financial-net-value')
@ApiBearerAuth()
@Controller('/api/financial/net-value')
export class FinancialNetValueController {
  @Inject()
  private readonly financialNetCleanService: FinancialNetValueCleanService;

  @Inject()
  private readonly financialNetService: FinancialNetValueService;

  @Get('list')
  @ApiOperation({ summary: '查询理财净值列表' })
  @ApiQuery({ name: 'code', required: true, type: String, description: '理财编码' })
  @ApiQuery({ name: 'current', required: false, type: Number, description: '页码' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, description: '分页大小' })
  @ApiOkResponse({
    description: '理财净值列表查询成功',
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
  list(@Query() query: FinancialNetValueQuery) {
    return this.financialNetService.getNetValueList(query);
  }

  @Post('clean')
  @ApiOperation({ summary: '清洗理财净值数据' })
  @ApiBody({ type: TrackFinancialCleanDto })
  @ApiOkResponse({
    description: '理财净值清洗任务执行成功',
    schema: { type: 'object', additionalProperties: true },
  })
  async cleanNetValue(@Body() body: TrackFinancialCleanDto) {
    // 清洗基金净值
    await this.financialNetCleanService.fillNetValue(body.code, body.from);
  }
}
