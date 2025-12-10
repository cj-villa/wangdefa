// base
export const CONSUL_CONFIGURATION_TOKEN = Symbol('Consul_Module_Config');
export const CONSUL_CONFIGURATION_LOADER = Symbol('Consul_Configuration_Loader');
export const CONSUL_BASE_SERVICE = Symbol('Consul_Base_Service');

// kv
export const CONSUL_KV_SERVICE_TOKEN = Symbol('Consul_KV_SERVICE');

// global key
// 预获取的key
export const CONSUL_PRE_FETCH_KEYS = Symbol('ConsulPreFetchKeys');
// 全局数据缓存
export const CONSUL_GLOBAL_DATA = Symbol('Consul_GLOBAL_DATA');
