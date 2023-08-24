import { ConverterInsertDTO } from '@l/shared/dto/converter/insert';
import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';
import { UserContext } from '@/app/context/service';
import { ConvertRuleModelService } from '@/app/convert-rule/service';
import { ConverterModelService } from '@/app/converter/service';

@Controller('/api/converter')
export class ConverterModelController {
  constructor(
    private converterModelService: ConverterModelService,
    private convertRuleModelService: ConvertRuleModelService,
    @Inject(UserContext) private userContext: UserContext
  ) {}

  @Get()
  async find() {
    return this.converterModelService.getMetaData({ userId: '2' });
  }

  @Post()
  @Transactional()
  async insert(@Body() record: ConverterInsertDTO) {
    const { rules, ...converterRecord } = record;
    const converter = await this.converterModelService.save(converterRecord);
    if (!rules.length) {
      return { converter };
    }
    const owner = this.userContext.user;
    const convertRules = await this.convertRuleModelService.save(
      rules.map((rule) => ({ ...rule, converter, owner }))
    );
    return { converter, rules: convertRules };
  }
}
