import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  MenuProps,
  Select,
} from '@mui/material';
import { StyledFormGrid } from './styled';
import { convertToMinutes } from './utils';

const menuProps: Partial<MenuProps> = {
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'left',
  },
  transformOrigin: {
    vertical: 'top',
    horizontal: 'left',
  },
  // getContentAnchorEl: null,
  PaperProps: {
    style: {
      maxHeight: '50vh', // Adjust this value to control the dropdown's max height
    },
  },
};

export function TimePicker({
  times,
  startTime,
  endTime,
  handleStartChange,
  handleEndChange,
}: any) {
  return (
    <StyledFormGrid container alignItems="baseline">
      <FormControl sx={{ width: '25%' }}>
        <InputLabel id="time-picker-start">Start</InputLabel>
        <Select
          labelId="time-picker-start"
          label="start"
          MenuProps={menuProps}
          value={startTime ? JSON.stringify(startTime) : ''}
          onChange={({ target: { value } }) =>
            handleStartChange(JSON.parse(value))
          }
        >
          {Object.entries(times).map(([key, timeSlot]: any, rowIndex) => (
            <MenuItem
              key={`TimePickerStart_${key}`}
              value={JSON.stringify(timeSlot)}
            >
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
        <Select
          labelId="time-picker-end"
          label="End"
          MenuProps={menuProps}
          value={endTime ? JSON.stringify(endTime) : ''}
          onChange={({ target: { value } }) =>
            handleEndChange(JSON.parse(value))
          }
        >
          {Object.entries(times).map(([key, timeSlot]: any, rowIndex) => (
            <MenuItem
              disabled={convertToMinutes(timeSlot) < convertToMinutes(startTime)}
              key={`TimePickerStart_${key}`}
              value={JSON.stringify(timeSlot)}
            >
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
