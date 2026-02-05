import React, { useState } from 'react';
import {
  type CalendarContextState,
  CalendarMode,
  CalendarProps,
} from 'src/components/calendar/type';
import dayjs, { OpUnitType } from 'dayjs';

export const CalendarContext = React.createContext<CalendarContextState | null>(null);

export const isInRange = (
  current: dayjs.Dayjs,
  unit?: OpUnitType,
  validRange?: [dayjs.Dayjs, dayjs.Dayjs]
) => {
  if (!validRange) {
    return true;
  }
  if (current.isBefore(validRange[0], unit)) {
    return false;
  }
  if (current.isAfter(validRange[1], unit)) {
    return false;
  }
  return true;
};

export const currentValidDate = (current: dayjs.Dayjs, validRange?: [dayjs.Dayjs, dayjs.Dayjs]) => {
  if (!validRange) {
    return current;
  }
  if (current.isBefore(validRange[0])) {
    return validRange[0];
  }
  if (current.isAfter(validRange[1])) {
    return validRange[1];
  }
  return current;
};

export const CalendarContextProvider: React.FC<
  React.PropsWithChildren<Pick<CalendarProps, 'validRange'>>
> = ({ children, ...rest }) => {
  const [mode, setMode] = React.useState<CalendarMode>(CalendarMode.Day);
  const [selected, setSelected] = useState(currentValidDate(dayjs(), rest.validRange));
  return (
    <CalendarContext.Provider value={{ mode, setMode, selected, setSelected, ...rest }}>
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendarContext = () => {
  const context = React.useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendarContext must be used within a CalendarContextProvider');
  }
  return context;
};
