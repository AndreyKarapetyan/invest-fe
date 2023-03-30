import { useCallback, useState } from 'react';
import { Api } from 'src/app/utils/Api';

export function useGetTeachers() {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getTeachers = useCallback((branchName: null | string) => {
    (async function () {
      try {
        setLoading(true);
        const { data: newData } = await Api.get(`/teachers/superadmin`, {
          qs: { branchName },
        });
        setData(newData);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return {
    teachers: data,
    teachersError: error,
    teachersLoading: loading,
    getTeachers,
  };
}