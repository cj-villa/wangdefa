import { Card, Flex, Typography } from 'antd';
import dayjs from 'dayjs';
import { groupBy } from 'lodash-es';
import React, { useMemo } from 'react';
import { Calendar } from 'src/components';
import { CalendarMode } from 'src/components/calendar/type';
import { FinancialDetail } from 'src/request/type/financial';
import { sum } from 'src/share/toolkits/array';
import { roundPrice } from 'src/share/toolkits/tookit';

const formatText = {
  d: 'YYYYMMDD',
  m: 'YYYYMM',
  y: 'YYYY',
};
const getDateKey = (date: dayjs.ConfigType, type: 'd' | 'm' | 'y') =>
  dayjs(date).format(formatText[type]);

const Text = ({ data, suffix = '' }: { data: number; suffix?: string }) => (
  <Typography.Text style={{ textAlign: 'center' }} type={data > 0 ? 'danger' : 'success'}>
    {data > 0 ? '+' : ''}
    {data}
    {suffix}
  </Typography.Text>
);

type Info = { [date: string]: { profit: number; rate: number } };

export const CalendarStatistics: React.FC<{ detail: FinancialDetail }> = ({ detail }) => {
  const { valueTrends } = detail;

  const dailyInfo = useMemo(() => {
    return valueTrends.reduce<Info>((prev, cur) => {
      prev[getDateKey(cur.date, 'd')] = {
        profit: roundPrice(cur.profit),
        rate: roundPrice((cur.profit / cur.balance) * 365 * 100),
      };
      return prev;
    }, {});
  }, [valueTrends]);

  const monthInfo = useMemo(() => {
    const trendGroupByMonth = groupBy(valueTrends, (item) => getDateKey(item.date, 'm'));
    return Object.keys(trendGroupByMonth).reduce<Info>((prev, cur) => {
      const items = trendGroupByMonth[cur];
      const totalProfit = sum(items, 'profit');
      const avgBalance = sum(items, 'balance') / items.length;
      prev[cur] = {
        profit: roundPrice(totalProfit),
        rate: roundPrice((totalProfit / avgBalance / items.length) * 365 * 100),
      };
      return prev;
    }, {});
  }, [valueTrends]);

  const yearInfo = useMemo(() => {
    const trendGroupByMonth = groupBy(valueTrends, (item) => getDateKey(item.date, 'y'));
    return Object.keys(trendGroupByMonth).reduce<Info>((prev, cur) => {
      const items = trendGroupByMonth[cur];
      const totalProfit = sum(items, 'profit');
      const avgBalance = sum(items, 'balance') / items.length;
      prev[cur] = {
        profit: roundPrice(totalProfit),
        rate: roundPrice((totalProfit / avgBalance / items.length) * 365 * 100),
      };
      return prev;
    }, {});
  }, [valueTrends]);

  return (
    <Card>
      <Calendar
        validRange={[dayjs(valueTrends[0].date), dayjs(valueTrends[valueTrends.length - 1].date)]}
        renderCell={(date, mode) => {
          if (mode === CalendarMode.Day) {
            const data = dailyInfo[getDateKey(date, 'd')];
            if (!data?.profit) {
              return null;
            }
            return (
              <Flex vertical gap={4}>
                <Text data={data.profit} />
                <Text data={data.rate} suffix="%" />
              </Flex>
            );
          }
          if (mode === CalendarMode.Month) {
            const data = monthInfo[getDateKey(date, 'm')];
            if (!data?.profit) {
              return null;
            }
            return (
              <Flex vertical gap={4}>
                <Text data={data.profit} />
                <Text data={data.rate} suffix="%" />
              </Flex>
            );
          }
          if (mode === CalendarMode.Year) {
            const data = yearInfo[getDateKey(date, 'y')];
            if (!data?.profit) {
              return null;
            }
            return (
              <Flex vertical gap={4}>
                <Text data={data.profit} />
                <Text data={data.rate} suffix="%" />
              </Flex>
            );
          }
          return null;
        }}
      />
    </Card>
  );
};
