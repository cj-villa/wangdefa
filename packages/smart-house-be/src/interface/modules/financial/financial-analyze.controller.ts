import { Controller, Get, Inject } from '@nestjs/common';
import { FinancialAnalyzeService } from '@/core/financial/domain/service/financial-analyze.service';

@Controller('/api/financial-analyze')
export class FinancialAnalyzeController {
  @Inject()
  private readonly financialDetailService: FinancialAnalyzeService;

  @Get('summary')
  getSummary() {
    return this.financialDetailService.getSummary();
  }
}
