import { Body, Controller, Get, Inject, Post, Query, UseInterceptors } from '@nestjs/common';
import { TrackFinancialCleanDto } from '@/core/financial/application/dto/track-financial-clean.dto';
import { FinancialNetValueCleanService } from '@/core/financial/domain/service/financial-net-value-clean.service';
import { FinancialNetValueService } from '@/core/financial/domain/service/financial-net-value.serivce';
import { FinancialNetValueQuery } from '@/core/financial/application/query/financial-net-value.query';
import { PaginationFormatInterceptor } from '@/interface/interceptor/response-format';

@Controller('/api/financial/net-value')
export class FinancialNetValueController {
  @Inject()
  private readonly financialNetCleanService: FinancialNetValueCleanService;

  @Inject()
  private readonly financialNetService: FinancialNetValueService;

  @Get('list')
  @UseInterceptors(PaginationFormatInterceptor)
  list(@Query() query: FinancialNetValueQuery) {
    return this.financialNetService.getNetValueList(query);
  }

  @Post('clean')
  async cleanNetValue(@Body() body: TrackFinancialCleanDto) {
    // 清洗基金净值
    await this.financialNetCleanService.fillNetValue(body.code, body.from);
  }
}
