import React, { useMemo } from 'react';
import { useCalendarContext } from 'src/components/calendar/context';
import { chunk } from 'lodash-es';
import { Flex } from 'antd';
import { CalendarCell } from 'src/components/calendar/body/cell';
import dayjs from 'dayjs';

export const YearBody: React.FC = () => {
  const { selected, validRange } = useCalendarContext();
  const list = useMemo(() => {
    const now = dayjs().year();
    const startYear = validRange?.[0]?.year() || now - 10;
    const endYear = validRange?.[1]?.year() || now + 1;
    const yearList = Array.from({ length: endYear - startYear + 1 }, (_, i) => ({
      text: startYear + i,
      highlight: true,
      date: dayjs(`${startYear + i}-01-01`),
    }));
    return chunk(yearList, 3);
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
