export const LOCAL_STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  ROLE: 'role',
} as const;

export const getAuth = () => {
  return {
    [LOCAL_STORAGE_KEYS.ACCESS_TOKEN]: localStorage.getItem(
      LOCAL_STORAGE_KEYS.ACCESS_TOKEN
    ),
    [LOCAL_STORAGE_KEYS.REFRESH_TOKEN]: localStorage.getItem(
      LOCAL_STORAGE_KEYS.REFRESH_TOKEN
    ),
    [LOCAL_STORAGE_KEYS.ROLE]: localStorage.getItem(LOCAL_STORAGE_KEYS.ROLE),
  };
};

export const setAuth = (
  key: (typeof LOCAL_STORAGE_KEYS)[keyof typeof LOCAL_STORAGE_KEYS],
  value: string
) => {
  localStorage.setItem(key, value);
};
