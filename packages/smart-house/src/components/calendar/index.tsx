import React from 'react';
import { Flex } from 'antd';
import { CalendarFilter } from 'src/components/calendar/filter';
import { CalendarContextProvider } from 'src/components/calendar/context';
import { CalendarProps } from 'src/components/calendar/type';
import { CalendarBody } from 'src/components/calendar/body';

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
