import React from 'react';
import cn from 'classnames';
import { Flex } from 'antd';
import s from './cell.module.less';
import { useCalendarContext } from 'src/components/calendar/context';
import dayjs from 'dayjs';

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
