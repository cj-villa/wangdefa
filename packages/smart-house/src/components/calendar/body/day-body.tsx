import React, { useMemo } from 'react';
import { isInRange, useCalendarContext } from 'src/components/calendar/context';
import { chunk } from 'lodash-es';
import { Flex } from 'antd';
import { CalendarCell } from 'src/components/calendar/body/cell';
import dayjs from 'dayjs';

const title = ['一', '二', '三', '四', '五', '六', '日'];

interface CellContent {
  text: number;
  highlight: boolean;
  date: dayjs.Dayjs;
}

export const DayBody: React.FC = () => {
  const { selected, validRange } = useCalendarContext();
  const list = useMemo(() => {
    const days = selected.daysInMonth();
    const currentMonth: CellContent[] = new Array(days).fill('').map((_, index) => ({
      text: index + 1,
      highlight: isInRange(selected.date(index + 1), 'day', validRange),
      date: dayjs(`${selected.year()}-${selected.month() + 1}-${index + 1}`),
    }));
    const firstDay = selected.startOf('month');
    const lastDay = selected.endOf('month');
    // 往前补齐
    const prefix = new Array((firstDay.day() || 7) - 1)
      .fill('')
      .reduce<CellContent[]>((list, _, index) => {
        const date = firstDay.subtract(index + 1, 'day');
        const text = date.date();
        list.unshift({
          text,
          highlight: false,
          date: dayjs(`${date.year()}-${date.month() + 1}-${text}`),
        });
        return list;
      }, []);
    // 向后补齐
    const suffix = new Array(7 - (lastDay.day() || 7))
      .fill('')
      .reduce<CellContent[]>((list, _, index) => {
        const date = lastDay.add(index + 1, 'day');
        const text = date.date();
        list.push({
          text,
          highlight: false,
          date: dayjs(`${date.year()}-${date.month() + 1}-${text}`),
        });
        return list;
      }, []);
    return chunk([...prefix, ...currentMonth, ...suffix], 7);
  }, [selected, validRange]);

  return (
    <Flex vertical>
      <Flex gap={4}>
        {title.map((text) => (
          <CalendarCell highlight small text={text} />
        ))}
      </Flex>
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
