import AMapLoader from '@amap/amap-jsapi-loader';
import { AMapGeolocationPlugin } from './plugins/geolocation';
import { AMapAutoCompletePlugin } from './plugins/auto-complete';

interface AMapOptions {
  plugins?: Set<string>;
}

export class AMap {
  static DefaultPlugins = ['Scale', 'Geolocation', 'MapType', 'ToolBar'] as const;

  private AMap: any;
  private map: Record<string, any> = {};
  private plugins: Record<string, any> = {};

  geolocation: AMapGeolocationPlugin;
  autoComplete?: AMapAutoCompletePlugin;

  constructor(options?: AMapOptions) {
    AMapLoader.load({
      key: 'add3da2574863062303e93441cb9f369',
      version: '2.0',
      plugins: [...(options?.plugins || []), ...AMap.DefaultPlugins].map((i) => `AMap.${i}`),
    }).then((AMap) => {
      this.AMap = AMap;
    });

    // 注册插件方法
    this.geolocation = new AMapGeolocationPlugin(this);
    if (options?.plugins?.has('AutoComplete')) {
      this.autoComplete = new AMapAutoCompletePlugin(this);
    }
  }

  getAMap(): any {
    return new Promise((resolve) => {
      if (this.AMap) {
        resolve(this.AMap);
      } else {
        setTimeout(() => resolve(this.getAMap()), 100);
      }
    });
  }

  /** 获取地图 */
  async getMap(id: string) {
    if (this.map[id]) {
      return this.map[id];
    }
    this.map[id] = new Promise(async (resolve) => {
      const AMap = await this.getAMap();
      const map = new AMap.Map(id, {
        zoom: 11,
      });
      this.map[id] = map;
      resolve(map);
    });
    return this.map[id];
  }

  /** 获取插件实例 */
  getPluginInstance(
    pluginName: string,
    options: { options?: Record<string, any>; registry?: boolean } = {}
  ): Promise<any> {
    if (this.plugins[pluginName]) {
      return Promise.resolve(this.plugins[pluginName]);
    }
    this.plugins[pluginName] = new Promise(async (resolve, reject) => {
      const AMap = await this.getAMap();
      if (options.registry) {
        await new Promise<void>((resolveRegistry) => {
          AMap.plugin(`AMap.${pluginName}`, () => resolveRegistry());
        });
      }
      try {
        const instance = new AMap[pluginName](options.options);
        this.plugins[pluginName] = instance;
        resolve(instance);
      } catch (error) {
        console.error(pluginName, AMap, error);
        reject(error);
      }
    });
    return this.plugins[pluginName];
  }
}
