export interface SystemConfig {
  key: string;
  value: any;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description?: string;
  updatedAt?: string;
  modifyIndex?: number;
}

export interface SystemConfigListResponse {
  data: SystemConfig[];
  total: number;
}

export interface UpdateSystemConfigRequest {
  key: string;
  value: any;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description?: string;
}