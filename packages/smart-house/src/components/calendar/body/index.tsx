import React from 'react';
import { DayBody } from 'src/components/calendar/body/day-body';
import { MonthBody } from 'src/components/calendar/body/month-body';
import { YearBody } from 'src/components/calendar/body/year-body';
import { CalendarMode } from 'src/components/calendar/type';
import { useCalendarContext } from '../context';

export const CalendarBody = () => {
  const { mode } = useCalendarContext();
  if (mode === CalendarMode.Day) return <DayBody />;
  if (mode === CalendarMode.Month) return <MonthBody />;
  if (mode === CalendarMode.Year) return <YearBody />;
  return null;
};
