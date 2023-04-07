import { useCallback, useState } from 'react';
import { Api } from 'src/app/utils/Api';

export function useUpdateTeacher() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const updateTeacher = useCallback((teacherId: number, data: any) => {
    (async function () {
      try {
        setLoading(true);
        const { data: id } = await Api.put(`/teachers/${teacherId}`, data);
        setIsSuccess(true);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const resetTeacherUpdateSuccess = () => {
    setIsSuccess(false);
  };

  return {
    teacherUpdateError: error,
    teacherUpdateLoading: loading,
    isTeacherUpdated: isSuccess,
    resetTeacherUpdateSuccess,
    updateTeacher,
  };
}
