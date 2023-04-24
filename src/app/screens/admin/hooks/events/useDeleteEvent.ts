import { useCallback, useState } from 'react';
import { Api } from 'src/app/utils/Api';

export function useDeleteEvent() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const deleteEvent = useCallback((params: any) => {
    (async function () {
      try {
        setLoading(true);
        await Api.delete(`/lessons`, params);
        setIsSuccess(true);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const resetEventDeleteSuccess = () => {
    setIsSuccess(false);
  };

  return {
    eventDeleteError: error,
    eventDeleteLoading: loading,
    isEventDeleted: isSuccess,
    resetEventDeleteSuccess,
    deleteEvent,
  };
}
