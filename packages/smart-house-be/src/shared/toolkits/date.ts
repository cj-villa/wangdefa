import dayjs from 'dayjs';

export const fillZero = (num: number) => {
  return `00${num}`.slice(-2);
};

/** 是否是相同的日期 */
export const isSameDate = (date1: Date, date2: Date) => dayjs(date1).isSame(dayjs(date2), 'day');
