import { All, Controller, HttpStatus, Res } from '@nestjs/common';
import { type Response } from 'express';

@Controller()
export class FallbackController {
  @All('*')
  handle(@Res() res: Response) {
    res.status(HttpStatus.NOT_FOUND).end();
    // res.status(404).end();
  }
}
