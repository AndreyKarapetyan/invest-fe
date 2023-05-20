import { Box } from '@mui/material';
import { getNextTimeSlot } from './utils';

export function EventSelection({
  roomId,
  timeSlot,
  handleMouseDown,
  handleMouseEnter,
  isSelected,
}: any) {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: isSelected ? 'rgba(0, 0, 255, 0.1)' : 'transparent',
      }}
      onMouseDown={() => handleMouseDown(roomId, timeSlot)}
      onMouseEnter={() => handleMouseEnter(roomId, getNextTimeSlot(timeSlot))}
    />
  );
}
