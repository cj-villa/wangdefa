/** 文件操作 */
import * as fs from 'fs';
import * as path from 'path';
import { Injectable, Logger } from '@nestjs/common';
import { md5 } from '@/utils';

@Injectable()
export class FileCacheService {
  private readonly logger = new Logger(FileCacheService.name);
  private CacheDirPath = path.resolve(__dirname, '../../../../.smart/pending');

  async WriteCache(file: Express.Multer.File) {
    const hash = md5(file.buffer);
    const fileName = hash + path.extname(file.originalname);
    const filePath = this.getFilePath(fileName);
    const isExist = await this.isExist(filePath);
    this.logger.log(`file ${fileName} check: ${isExist}`);
    if (isExist) {
      return;
    }
    fs.writeFileSync(filePath, file.buffer);
    return hash;
  }

  /** 获取缓存文件的路径 */
  private getFilePath(fileName: string) {
    return path.join(this.CacheDirPath, fileName);
  }

  private isExist(filePath: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      fs.stat(filePath, { bigint: false }, (err) => {
        if (err) {
          if (err.code === 'ENOENT') {
            resolve(false);
          } else {
            reject(err);
          }
          return;
        }
        resolve(true);
      });
    });
  }
}
