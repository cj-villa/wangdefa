import { AMapPlugin } from './base';

export class AMapAutoCompletePlugin extends AMapPlugin {
  protected Name = 'AutoComplete';

  async search(keyword: string): Promise<any> {
    const instance = await this.getInstance();

    return new Promise((resolve, reject) => {
      instance.search(keyword, (status: string, result: any) => {
        if (status == 'complete') {
          resolve(result);
        } else {
          reject(result);
        }
      });
    });
  }
}
