import { useCallback, useState } from 'react';
import { Api } from 'src/app/utils/Api';

export function useLogin() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = useCallback((data: any) => {
    (async function () {
      try {
        setLoading(true);
        const { data: newData } = await Api.post(`/login`, data);
        setData(newData);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return {
    authData: data,
    error,
    loading,
    login,
  };
}
