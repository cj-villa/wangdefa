export class FireflyCategory {
  // 基本信息
  name: string;
  notes?: string;

  // 统计（可能为空）
  spent?: string;

  // 系统字段
  created_at: string;
  updated_at: string;
}
