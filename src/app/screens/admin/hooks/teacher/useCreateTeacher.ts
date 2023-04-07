import { useCallback, useState } from 'react';
import { Api } from 'src/app/utils/Api';

export function useCreateTeacher() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newTeacherId, setNewTeacherId] = useState(null);

  const createTeacher = useCallback((data: any) => {
    (async function () {
      try {
        setLoading(true);
        const { data: id } = await Api.post(`/teachers`, data);
        setNewTeacherId(id);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const resetTeacherId = () => {
    setNewTeacherId(null);
  };

  return {
    teacherCreateError: error,
    teacherCreateLoading: loading,
    newTeacherId,
    resetTeacherId,
    createTeacher,
  };
}
