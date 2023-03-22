import { useState } from 'react';
import { Api } from 'src/app/utils/Api';

export function useUpdateStudent() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const updateStudent = (data: any) => {
    (async function () {
      try {
        setLoading(true);
        await Api.put(`/students/${data.id}`, data);
        setIsSuccess(true);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  };

  const resetStudentUpdateSuccess = () => {
    setIsSuccess(false);
  };

  return {
    studentUpdateError: error,
    studentUpdateLoading: loading,
    isStudentUpdated: isSuccess,
    resetStudentUpdateSuccess,
    updateStudent,
  };
}
