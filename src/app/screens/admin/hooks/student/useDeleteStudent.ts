import { useCallback, useState } from 'react';
import { Api } from 'src/app/utils/Api';

export function useDeleteStudent() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const deleteStudent = useCallback((studentId: number) => {
    (async function () {
      try {
        setLoading(true);
        await Api.delete(`/students/${studentId}`);
        setIsSuccess(true);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const resetStudentDeleteSuccess = () => {
    setIsSuccess(false);
  };

  return {
    studentDeleteError: error,
    studentDeleteLoading: loading,
    isStudentDeleted: isSuccess,
    resetStudentDeleteSuccess,
    deleteStudent,
  };
}
