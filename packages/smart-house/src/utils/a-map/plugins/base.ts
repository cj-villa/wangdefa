import type { AMap } from '../a-map';

export class AMapPlugin {
  protected Name = 'Geolocatoin';
  constructor(protected AMap: AMap) {}

  protected getInstance(options?: Record<string, any>) {
    return this.AMap.getPluginInstance(this.Name, options);
  }
}
