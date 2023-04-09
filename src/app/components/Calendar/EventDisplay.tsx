import { Box } from "@mui/material";

export function EventDisplay({ title, description, height }: any) {
  return (
    <Box
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
      }}
    >
      <Box
        sx={{
          fontSize: '12px',
          fontWeight: 'bold',
          marginBottom: '2px',
        }}
      >
        {title}
      </Box>
      <Box sx={{ fontSize: '10px', textAlign: 'center' }}>{description}</Box>
    </Box>
  );
}