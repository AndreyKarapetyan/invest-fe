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
import { useCallback, useEffect, useState } from 'react';
import { useJwt } from 'react-jwt';
import { useLogin } from './hooks';
import { HOME_ROUTE } from '../../routeNames';

export function Login() {
  const { accessToken } = getAuth();
  const { isExpired } = useJwt(accessToken || '');
  const { login, authData, error, loading, resetError } = useLogin();
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState<{ email: string; password: string }>({ email: '', password: '' });
  const [isValidationError, setIsValidationError] = useState(false);

  const onInputChange = useCallback(
    ({ target: { value = '', name = '' } }: React.ChangeEvent<HTMLInputElement>) => {
      if (isValidationError) {
        setIsValidationError(false);
      }
      setLoginData((prevState) => ({ ...prevState, [name]: value }));
    },
    [isValidationError],
  );

  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    login(loginData);
  }, [loginData]);

  useEffect(() => {
    if (accessToken && !isExpired) {
      navigate(HOME_ROUTE);
    }
  }, [accessToken, isExpired]);

  useEffect(() => {
    if (authData) {
      const { accessToken, refreshToken, role } = authData;
      setAuth('accessToken', accessToken);
      setAuth('refreshToken', refreshToken);
      setAuth('role', role);
      navigate(HOME_ROUTE);
    }
  }, [authData]);

  useEffect(() => {
    if (error?.response) {
      setIsValidationError(true);
      resetError();
    }
  }, [error]);

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
            error={isValidationError}
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            value={loginData.email}
            onChange={onInputChange}
          />
          <TextField
            margin="normal"
            required
            error={isValidationError}
            helperText={isValidationError ? 'Incorrect email or password' : ''}
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            value={loginData.password}
            onChange={onInputChange}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Login
          </Button>
        </Box>
      </Box>
      {loading && <LoadingIndicator open={loading} />}
    </Container>
  );
}
