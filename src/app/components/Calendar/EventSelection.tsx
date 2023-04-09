import { Box } from '@mui/material';

export function EventSelection({
  roomIndex,
  timeSlot,
  handleMouseDown,
  handleMouseUp,
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
      onMouseDown={() => handleMouseDown(roomIndex, timeSlot)}
      onMouseUp={handleMouseUp}
      onMouseEnter={() => handleMouseEnter(roomIndex, timeSlot)}
    />
  );
}
