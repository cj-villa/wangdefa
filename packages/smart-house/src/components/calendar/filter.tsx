import React, { useMemo } from 'react';
import { Flex, Radio, Select } from 'antd';
import { CalendarMode } from 'src/components/calendar/type';
import { currentValidDate, useCalendarContext } from 'src/components/calendar/context';
import dayjs from 'dayjs';

export const CalendarFilter: React.FC = () => {
  const { mode, setMode, selected, setSelected, validRange } = useCalendarContext();
  const { year, month } = useMemo(
    () => ({ year: selected.year(), month: selected.month() + 1 }),
    [selected]
  );

  const yearOptions = useMemo(() => {
    const now = dayjs().year();
    const startYear = validRange?.[0]?.year() || now - 10;
    const endYear = validRange?.[1]?.year() || now + 1;
    return Array.from({ length: endYear - startYear + 1 }, (_, i) => ({
      label: `${startYear + i}年`,
      value: startYear + i,
    }));
  }, [validRange]);

  const monthOptions = useMemo(() => {
    const start = validRange?.[0];
    const end = validRange?.[1];
    const list = Array.from({ length: 12 }, (_, i) => ({
      label: `${i + 1}月`,
      value: i + 1,
    }));
    if (start && year === start.year()) {
      const startMonth = start.month() + 1;
      list.splice(0, startMonth - 1);
    }
    if (end && end.isAfter(start) && year === end.year()) {
      const endMonth = end.month() + 1;
      const currentFirst = list[0].value;
      list.splice(endMonth - currentFirst + 1, list.length - endMonth + currentFirst - 1);
    }
    return list;
  }, [validRange, year]);

  return (
    <Flex justify="flex-end" style={{ width: '100%' }} gap={12}>
      {mode !== CalendarMode.Year && (
        <Select
          style={{ flexShrink: 0 }}
          options={yearOptions}
          value={year}
          onChange={(value) => {
            setSelected((prev) => currentValidDate(prev.year(value), validRange));
          }}
        />
      )}
      {mode === CalendarMode.Day && (
        <Select
          style={{ flexShrink: 0 }}
          options={monthOptions}
          value={month}
          onChange={(value) => {
            setSelected((prev) => currentValidDate(prev.month(value - 1), validRange));
          }}
        />
      )}
      <Radio.Group value={mode} onChange={(e) => setMode(e.target.value)} buttonStyle="solid">
        <Radio.Button value={CalendarMode.Day}>日收益</Radio.Button>
        <Radio.Button value={CalendarMode.Month}>月收益</Radio.Button>
        <Radio.Button value={CalendarMode.Year}>年收益</Radio.Button>
      </Radio.Group>
    </Flex>
  );
};
