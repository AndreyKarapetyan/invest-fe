import { useCallback, useState } from 'react';
import { Api } from 'src/app/utils/Api';

export function useCreateEvent() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const createEvent = useCallback((data: any) => {
    (async function () {
      try {
        setLoading(true);
        await Api.post(`/lessons`, data);
        setIsSuccess(true);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const resetEventCreationSuccess = () => {
    setIsSuccess(false);
  }

  return {
    studentCreationError: error,
    studentCreationLoading: loading,
    isEventCreated: isSuccess,
    resetEventCreationSuccess,
    createEvent,
  };
}