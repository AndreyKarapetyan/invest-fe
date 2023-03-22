import { Backdrop, CircularProgress, Theme } from '@mui/material';

export function LoadingIndicator({ open }: any) {
  return (
    <Backdrop
      unmountOnExit
      sx={{
        color: '#fff',
        zIndex: (theme: Theme) => theme.zIndex.modal + 1,
      }}
      open={open}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
