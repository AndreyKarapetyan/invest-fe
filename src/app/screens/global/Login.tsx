import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { getAuth, setAuth } from 'src/app/utils/auth';
import { LoadingIndicator } from 'src/app/components/LoadingIndicator';
import { useNavigate } from 'react-router-dom';
import { Role } from 'src/app/types/role';
import { STUDENTS_LIST_ROUTE } from 'src/app/routeNames';
import { useCallback, useEffect } from 'react';
import { useJwt } from 'react-jwt';
import { useLogin } from './hooks';
import { HOME_ROUTE } from '../../routeNames';

export function Login() {
  const { accessToken } = getAuth();
  const { isExpired } = useJwt(accessToken || '');
  const { login, authData, error, loading } = useLogin();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      login({
        email: data.get('email'),
        password: data.get('password'),
      });
    },
    []
  );

  useEffect(() => {
    if (accessToken && !isExpired) {
      navigate(HOME_ROUTE);
    }
  }, [accessToken, isExpired])

  useEffect(() => {
    if (authData) {
      const { accessToken, refreshToken, role } = authData;
      setAuth('accessToken', accessToken);
      setAuth('refreshToken', refreshToken);
      setAuth('role', role);
      if (role === Role.SuperAdmin) {
        navigate(STUDENTS_LIST_ROUTE);
      }
    }
  }, [authData]);

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
        </Box>
      </Box>
      {loading && <LoadingIndicator open={loading} />}
    </Container>
  );
}
