import React, { useMemo } from 'react';
import { isInRange, useCalendarContext } from 'src/components/calendar/context';
import { chunk } from 'lodash-es';
import { Flex } from 'antd';
import { CalendarCell } from 'src/components/calendar/body/cell';
import dayjs from 'dayjs';

interface CellContent {
  text: string;
  highlight: boolean;
  date: dayjs.Dayjs;
}

export const MonthBody: React.FC = () => {
  const { selected, validRange } = useCalendarContext();
  const list = useMemo(() => {
    const monthList: CellContent[] = new Array(12).fill('').map((_, index) => ({
      text: `${index + 1}月`,
      highlight: isInRange(selected.month(index), 'month', validRange),
      date: dayjs(`${selected.year()}-${index + 1}-01`),
    }));
    return chunk(monthList, 3);
  }, [selected, validRange]);
  return (
    <Flex vertical>
      {list.map((row) => (
        <Flex gap={4}>
          {row.map((item) => (
            <CalendarCell hover highlight={item.highlight} text={item.text} date={item.date} />
          ))}
        </Flex>
      ))}
    </Flex>
  );
};
