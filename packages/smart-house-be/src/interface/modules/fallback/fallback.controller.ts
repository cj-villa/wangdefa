import { All, Controller, HttpStatus, Res } from '@nestjs/common';
import { type Response } from 'express';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('fallback')
@ApiBearerAuth()
@Controller()
export class FallbackController {
  @All('*')
  @ApiOperation({ summary: '未匹配路由兜底处理' })
  @ApiResponse({ status: 404, description: '未找到对应路由' })
  handle(@Res() res: Response) {
    res.status(HttpStatus.NOT_FOUND).end();
    // res.status(404).end();
  }
}
