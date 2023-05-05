import { Box, Button, styled, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Container = styled(Box)(({ theme }) => ({
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  background: theme.palette.background.default,
}));

const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: theme.spacing(2),
}));

const Text = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

export function NotFound() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Container>
      <Title variant="h1" color="primary">
        404
      </Title>
      <Text variant="h4" color="textSecondary">
        Oops! The page you're looking for doesn't exist.
      </Text>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={handleGoBack}
      >
        Go Back
      </Button>
    </Container>
  );
}
