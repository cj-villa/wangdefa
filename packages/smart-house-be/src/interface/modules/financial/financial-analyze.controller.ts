import { Controller, Get, Inject } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FinancialAnalyzeService } from '@/core/financial/domain/service/financial-analyze.service';

@ApiTags('financial-analyze')
@ApiBearerAuth()
@Controller('/api/financial-analyze')
export class FinancialAnalyzeController {
  @Inject()
  private readonly financialDetailService: FinancialAnalyzeService;

  @Get('summary')
  @ApiOperation({ summary: '获取理财汇总信息' })
  @ApiOkResponse({
    description: '理财汇总信息查询成功',
    schema: { type: 'object', additionalProperties: true },
  })
  getSummary() {
    return this.financialDetailService.getSummary();
  }
}
