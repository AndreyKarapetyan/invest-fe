import { useCallback, useState } from 'react';
import { Api } from 'src/app/utils/Api';

export function useDeleteTeacher() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const deleteTeacher = useCallback((teacherId: number) => {
    (async function () {
      try {
        setLoading(true);
        await Api.delete(`/teachers/${teacherId}`);
        setIsSuccess(true);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const resetTeacherDeleteSuccess = () => {
    setIsSuccess(false);
  };

  return {
    teacherDeleteError: error,
    teacherDeleteLoading: loading,
    isTeacherDeleted: isSuccess,
    resetTeacherDeleteSuccess,
    deleteTeacher,
  };
}
