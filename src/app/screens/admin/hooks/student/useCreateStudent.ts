import { useCallback, useState } from 'react';
import { Api } from 'src/app/utils/Api';

export function useCreateStudent() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const createStudent = useCallback((data: any) => {
    (async function () {
      try {
        setLoading(true);
        await Api.post(`/students`, data);
        setIsSuccess(true);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const resetStudentCreationSuccess = () => {
    setIsSuccess(false);
  }

  return {
    studentCreationError: error,
    studentCreationLoading: loading,
    isStudentCreated: isSuccess,
    resetStudentCreationSuccess,
    createStudent,
  };
}