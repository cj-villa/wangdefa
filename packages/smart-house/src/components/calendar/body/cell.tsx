import { Flex } from 'antd';
import cn from 'classnames';
import dayjs from 'dayjs';
import React from 'react';
import { useCalendarContext } from 'src/components/calendar/context';
import s from './cell.module.less';

interface CalendarCellProps {
  text: string | number;
  small?: boolean;
  highlight?: boolean;
  hover?: boolean;
  date?: dayjs.Dayjs;
}

export const CalendarCell: React.FC<CalendarCellProps> = (props) => {
  const { renderCell, mode } = useCalendarContext();
  const { text, small, highlight, hover, date } = props;

  return (
    <Flex
      className={cn(s.cell, {
        [s['cell-small']]: small,
        [s['cell-highlight']]: highlight,
        [s['cell-hover']]: hover,
      })}
      vertical
    >
      <p className={s['cell-corner']}>{text}</p>
      {date && renderCell?.(date, mode)}
    </Flex>
  );
};
