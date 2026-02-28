import { Flex } from 'antd';
import React from 'react';
import { CalendarBody } from 'src/components/calendar/body';
import { CalendarContextProvider } from 'src/components/calendar/context';
import { CalendarFilter } from 'src/components/calendar/filter';
import { CalendarProps } from 'src/components/calendar/type';

export const Calendar: React.FC<CalendarProps> = (props) => {
  return (
    <CalendarContextProvider {...props}>
      <Flex vertical gap={24}>
        <CalendarFilter />
        <CalendarBody />
      </Flex>
    </CalendarContextProvider>
  );
};
