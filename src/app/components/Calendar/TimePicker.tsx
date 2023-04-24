import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  MenuProps,
  Select,
  styled,
} from '@mui/material';
import { useMemo } from 'react';
import { generateTimeSlots } from './utils';
import { StyledFormGrid } from './styled';

const menuProps: Partial<MenuProps> = {
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "left",
  },
  transformOrigin: {
    vertical: "top",
    horizontal: "left",
  },
  // getContentAnchorEl: null,
  PaperProps: {
    style: {
      maxHeight: "50vh", // Adjust this value to control the dropdown's max height
    },
  },
};

export function TimePicker() {
  const times = useMemo(generateTimeSlots, []);
  return (
    <StyledFormGrid container alignItems="baseline">
      <FormControl sx={{ width: '25%' }}>
        <InputLabel id="time-picker-start">Start</InputLabel>
        <Select labelId="time-picker-start" label="start" MenuProps={menuProps}>
          {Object.entries(times).map(([key, timeSlot], rowIndex) => (
            <MenuItem key={`TimePickerStart_${key}`} value={key}>
              {rowIndex % 4 === 0 &&
                `${timeSlot.hour < 10 ? '0' : ''}${timeSlot.hour}:00`}
              {rowIndex % 4 === 1 &&
                `${timeSlot.hour < 10 ? '0' : ''}${timeSlot.hour}:15`}
              {rowIndex % 4 === 2 &&
                `${timeSlot.hour < 10 ? '0' : ''}${timeSlot.hour}:30`}
              {rowIndex % 4 === 3 &&
                `${timeSlot.hour < 10 ? '0' : ''}${timeSlot.hour}:45`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box
        sx={{
          marginX: '7%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          height: '2px',
          width: '50px',
        }}
      />
      <FormControl sx={{ width: '25%' }}>
        <InputLabel id="time-picker-end">End</InputLabel>
        <Select labelId="time-picker-end" label="End" MenuProps={menuProps}>
          {Object.entries(times).map(([key, timeSlot], rowIndex) => (
            <MenuItem key={`TimePickerStart_${key}`} value={key}>
              {rowIndex % 4 === 0 &&
                `${timeSlot.hour < 10 ? '0' : ''}${timeSlot.hour}:00`}
              {rowIndex % 4 === 1 &&
                `${timeSlot.hour < 10 ? '0' : ''}${timeSlot.hour}:15`}
              {rowIndex % 4 === 2 &&
                `${timeSlot.hour < 10 ? '0' : ''}${timeSlot.hour}:30`}
              {rowIndex % 4 === 3 &&
                `${timeSlot.hour < 10 ? '0' : ''}${timeSlot.hour}:45`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </StyledFormGrid>
  );
}
