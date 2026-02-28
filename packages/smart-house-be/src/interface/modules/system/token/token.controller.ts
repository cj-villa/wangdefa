import { Body, Controller, Get, Inject, Post, Query, UseInterceptors } from '@nestjs/common';
import {
  CreateTokenDto,
  TokenDeleteDto,
  TokenManageService,
  TokenSearchService,
} from '@/core/token';
import { PaginationFormatInterceptor } from '@/interface/interceptor/response-format';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('system-token')
@ApiBearerAuth()
@Controller('/api/system')
export class TokenController {
  @Inject()
  private readonly tokenManageService: TokenManageService;

  @Inject()
  private readonly tokenSearchService: TokenSearchService;

  @Get('list')
  @ApiOperation({ summary: '查询当前用户 token 列表' })
  @ApiQuery({ name: 'current', required: false, type: Number, description: '页码' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, description: '分页大小' })
  @ApiOkResponse({
    description: 'token 列表查询成功',
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
  list(@Query('current') current: number, @Query('pageSize') pageSize: number) {
    return this.tokenSearchService.list(current, pageSize);
  }

  @Post('create')
  @ApiOperation({ summary: '创建访问 token' })
  @ApiBody({ type: CreateTokenDto })
  @ApiOkResponse({
    description: 'token 创建成功',
    schema: { type: 'object', additionalProperties: true },
  })
  create(@Body() body: CreateTokenDto) {
    return this.tokenManageService.create(body.name);
  }

  @Post('delete')
  @ApiOperation({ summary: '删除访问 token' })
  @ApiBody({ type: TokenDeleteDto })
  @ApiOkResponse({
    description: 'token 删除成功',
    schema: { type: 'object', additionalProperties: true },
  })
  delete(@Body() body: TokenDeleteDto) {
    return this.tokenManageService.delete(body.id);
  }
}
