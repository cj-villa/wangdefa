import { ApiProperty } from '@nestjs/swagger';

export class FireflyBasicInfoDTO {
  /** 账户列表 */
  @ApiProperty({ example: ['招商银行'] })
  accounts: string[];
  /** 预算列表 */
  @ApiProperty({ example: ['餐饮'] })
  budgets: string[];
  /** 分类列表 */
  @ApiProperty({ example: ['午饭'] })
  categories: string[];
  /** 标签列表 */
  @ApiProperty({ example: ['基础饮食'] })
  tags: string[];
}
