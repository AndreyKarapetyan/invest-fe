import { useCallback, useState } from 'react';
import { Api } from 'src/app/utils/Api';

export function useGetTeacher() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getTeacher = useCallback((teacherId: number) => {
    (async function () {
      try {
        setLoading(true);
        const { data: newData } = await Api.get(
          `/teachers/superadmin/${teacherId}`
        );
        setData(newData);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return {
    teacher: data,
    teacherError: error,
    teacherLoading: loading,
    getTeacher,
  };
}
