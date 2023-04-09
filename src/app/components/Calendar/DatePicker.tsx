import { LocalizationProvider, StaticDatePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { memo } from 'react';

export const DatePicker = memo(function DatePicker({ date, onChange }: any) {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <StaticDatePicker
        displayStaticWrapperAs="desktop"
        openTo="day"
        value={date}
        onChange={onChange}
      />
    </LocalizationProvider>
  );
});
