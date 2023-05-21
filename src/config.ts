const { NODE_ENV = 'local' } = process.env;

export let BASE_API_URL = 'http://localhost:8080/';
if (NODE_ENV === 'local') {
  BASE_API_URL = 'http://localhost:8080/'
} else {
  BASE_API_URL = 'https://2qqeiv6rgp.eu-west-1.awsapprunner.com/'
}
export const USER_REFRESH_TOKEN_URL = '/refresh-token';

