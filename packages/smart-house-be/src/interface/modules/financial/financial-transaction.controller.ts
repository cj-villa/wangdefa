import { Body, Controller, Get, Inject, Post, Query, UseInterceptors } from '@nestjs/common';
import { PaginationFormatInterceptor } from '@/interface/interceptor/response-format';
import { DeleteDto } from '@/core/common/application/dto/delete.dto';
import { TrackFinancialTransactionService } from '@/core/financial/domain/service/track-financial-transaction.service';
import { TrackFinancialTransactionQuery } from '@/core/financial/application/query/track-financial-transaction.query';
import { TrackFinancialTransactionCreateDto } from '@/core/financial/application/dto/track-financial-transaction-create.dto';
import { TrackFinancialTransactionUpdateDto } from '@/core/financial/application/dto/track-financial-transaction-update.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('financial-transaction')
@ApiBearerAuth()
@Controller('/api/financial/transaction')
export class FinancialTransactionController {
  @Inject()
  private readonly trackFinancialTransactionService: TrackFinancialTransactionService;

  @Get('list')
  @ApiOperation({ summary: '查询理财交易记录列表' })
  @ApiQuery({ name: 'financialId', required: false, type: String, description: '理财ID' })
  @ApiQuery({ name: 'transactionType', required: false, type: String, description: '交易类型' })
  @ApiQuery({ name: 'from', required: false, type: String, description: '起始日期' })
  @ApiQuery({ name: 'to', required: false, type: String, description: '结束日期' })
  @ApiQuery({ name: 'orderBy', required: false, type: String, description: '排序方向 ASC/DESC' })
  @ApiQuery({ name: 'current', required: false, type: Number, description: '页码' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, description: '分页大小' })
  @ApiOkResponse({
    description: '理财交易记录查询成功',
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
  list(@Query() query: TrackFinancialTransactionQuery) {
    return this.trackFinancialTransactionService.list(query);
  }

  @Post('create')
  @ApiOperation({ summary: '创建理财交易记录' })
  @ApiBody({ type: TrackFinancialTransactionCreateDto })
  @ApiOkResponse({
    description: '理财交易记录创建成功',
    schema: { type: 'object', additionalProperties: true },
  })
  create(@Body() body: TrackFinancialTransactionCreateDto) {
    return this.trackFinancialTransactionService.create(body);
  }

  @Post('delete')
  @ApiOperation({ summary: '删除理财交易记录' })
  @ApiBody({ type: DeleteDto })
  @ApiOkResponse({
    description: '理财交易记录删除成功',
    schema: { type: 'object', additionalProperties: true },
  })
  delete(@Body() body: DeleteDto) {
    return this.trackFinancialTransactionService.delete(body.id);
  }

  @Post('update')
  @ApiOperation({ summary: '更新理财交易记录' })
  @ApiBody({ type: TrackFinancialTransactionUpdateDto })
  @ApiOkResponse({
    description: '理财交易记录更新成功',
    schema: { type: 'object', additionalProperties: true },
  })
  update(@Body() body: TrackFinancialTransactionUpdateDto) {
    return this.trackFinancialTransactionService.update(body);
  }
}
