import { useCallback, useState } from 'react';
import { Api } from 'src/app/utils/Api';

export function useUpdateEvent() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const updateEvent = useCallback((data: any) => {
    (async function () {
      try {
        setLoading(true);
        await Api.put(`/lessons`, data);
        setIsSuccess(true);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const resetEventUpdateSuccess = () => {
    setIsSuccess(false);
  }

  return {
    eventUpdateError: error,
    eventUpdateLoading: loading,
    isEventUpdated: isSuccess,
    resetEventUpdateSuccess,
    updateEvent,
  };
}