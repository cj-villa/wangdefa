import { Type } from 'class-transformer';
import { IsDefined, IsEnum, IsOptional, MaxLength, ValidateNested } from 'class-validator';
import {
  BillConverterModel,
  BillConvertRuleModel,
  BillConvertRuleAction,
  BillConvertRuleOperator,
  BillSourceEnum,
} from '../../model';
import type { InsertType } from '../../type-gymnastics';

type DTO = InsertType<BillConverterModel> & {
  rules: Array<InsertType<BillConvertRuleModel>>;
};

class ConvertRuleInsertDTO implements InsertType<BillConvertRuleModel> {
  @IsOptional()
  @IsEnum(BillSourceEnum)
  billSource?: BillSourceEnum;

  @IsEnum(BillConvertRuleAction)
  action!: BillConvertRuleAction;

  @IsDefined({ message: 'source不可为空' })
  source!: string;

  @IsEnum(BillConvertRuleOperator)
  operator!: BillConvertRuleOperator;

  @IsDefined({ message: 'right不可为空' })
  right!: string;
}

export class ConverterInsertDTO implements DTO {
  @MaxLength(32, {
    message: '规则名称不可长于32位',
  })
  @IsDefined({ message: '规则名称不可为空' })
  name!: string;

  @ValidateNested()
  @Type(() => ConvertRuleInsertDTO)
  @IsDefined({ message: '请传入具体的规则内容' })
  rules!: ConvertRuleInsertDTO[];
}
