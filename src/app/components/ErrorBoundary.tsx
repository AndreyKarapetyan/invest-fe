import { FallbackProps, ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { Button, Container, Grid, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const FallbackComponent = ({ resetErrorBoundary, error }: FallbackProps) => {
  console.log('The critical error is: ', error);
  return (
    <Container maxWidth="sm">
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={4}
        style={{ minHeight: '100vh' }}
      >
        <Grid item fontSize="66px">
          <ErrorOutlineIcon fontSize="inherit" color="error" />
        </Grid>
        <Grid item>
          <Typography variant="h6" align="center" color="error">
            Oops! Something went wrong.
          </Typography>
        </Grid>
        <Grid item>
          <Button variant="contained" color="secondary" onClick={resetErrorBoundary}>
            Reload
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export function ErrorBoundary({ children }: any) {
  return <ReactErrorBoundary FallbackComponent={FallbackComponent} children={children} />;
}
