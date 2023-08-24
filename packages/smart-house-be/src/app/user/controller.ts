import { UserDeleteDTO } from '@l/shared/dto/user/model';
import { Body, Controller, Delete, Get } from '@nestjs/common';
import { UserModelService } from 'src/app/user/service';

@Controller('api/user')
export class UserController {
  constructor(private userModelService: UserModelService) {}

  @Get()
  findAll() {
    return this.userModelService.getMetaData();
  }

  @Delete()
  destroy(@Body() body: UserDeleteDTO) {
    return this.userModelService.delete(body.id);
  }
}
