export class FireflyTag {
  // 基本
  tag: string;
  date?: string;
  description?: string;

  // 统计
  latitude?: number;
  longitude?: number;
  zoom_level?: number;

  // 系统
  created_at: string;
  updated_at: string;
}
