import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BillImportService } from '../service';

@Controller('api/bill/metadata')
export class BillImportController {
  constructor(private billImportService: BillImportService) {}

  @Post()
  @UseInterceptors(FileInterceptor('bill'))
  import(@UploadedFile() bill: Express.Multer.File) {
    return this.billImportService.run(bill);
  }
}
