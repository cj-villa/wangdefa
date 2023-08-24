import { decode } from 'iconv-lite';

/** 解码文件内容，优先尝试utf8 */
export const decodeFile = (file: Buffer) => {
  const utf8Content = file.toString('utf8', 0, 100);
  if (!utf8Content.includes('�')) {
    return file.toString();
  }
  return decode(file, 'gbk');
};
