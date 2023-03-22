import { Snackbar, Fade, Alert, styled } from '@mui/material';

const StyledSnackbar = styled(Snackbar)(({ theme }) => ({
  '& .MuiSnackbar-root': {
    top: theme.spacing(2),
  },
}));

export function TopCenterSnackbar({ open, message }: any) {
  return (
    <Fade in={open}>
      <StyledSnackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={open}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </StyledSnackbar>
    </Fade>
  );
}
