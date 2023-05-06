import { useCallback, useState } from 'react';
import { Api } from 'src/app/utils/Api';

export function useGetAllStudentsMinData() {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getAllStudentsMinData = useCallback((data: any) => {
    (async function () {
      try {
        setLoading(true);
        const { data: newData } = await Api.get(`/students`, {
          qs: data,
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
    students: data,
    studentsError: error,
    studentsLoading: loading,
    getAllStudentsMinData,
  };
}