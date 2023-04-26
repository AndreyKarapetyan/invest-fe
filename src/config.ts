const { NODE_ENV = 'local' } = process.env;

export let BASE_API_URL = 'http://localhost:8080/api';
if (NODE_ENV === 'local') {
  BASE_API_URL = 'http://localhost:8080/api'
}
export const USER_REFRESH_TOKEN_URL = '/refresh-token';

