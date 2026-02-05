import type dayjs from 'dayjs';
import type React from 'react';

export enum CalendarMode {
  Day = 'day',
  Month = 'month',
  Year = 'year',
}

export interface CalendarProps {
  validRange?: [dayjs.Dayjs, dayjs.Dayjs];
  renderCell?: (date: dayjs.Dayjs, mode: CalendarMode) => React.ReactNode;
}

export interface CalendarContextState extends Pick<CalendarProps, 'validRange' | 'renderCell'> {
  mode: CalendarMode;
  setMode: (mode: CalendarMode) => void;
  selected: dayjs.Dayjs;
  setSelected: React.Dispatch<React.SetStateAction<dayjs.Dayjs>>;
}
