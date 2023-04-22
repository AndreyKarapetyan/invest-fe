import { Box, ButtonBase } from '@mui/material';

export function EventDisplay({
  teacherFullName,
  groupName,
  height,
  handleEventClick,
}: any) {
  return (
    <ButtonBase
      onClick={handleEventClick}
      sx={{
        backgroundColor: 'rgba(255, 0, 0, 0.3)',
        height: `calc(${height}%)`,
        width: '90%',
        left: '5%',
        position: 'absolute',
        top: '1px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
      }}
    >
      <Box
        sx={{
          fontSize: '12px',
          fontWeight: 'bold',
          marginBottom: '2px',
        }}
      >
        {teacherFullName}
      </Box>
      <Box sx={{ fontSize: '10px', textAlign: 'center' }}>{groupName}</Box>
    </ButtonBase>
  );
}
