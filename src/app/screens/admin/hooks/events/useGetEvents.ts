import { useCallback, useState } from 'react';
import { Api } from 'src/app/utils/Api';

export function useGetEvents() {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getEvents = useCallback((branchName: null | string, date: string) => {
    (async function () {
      try {
        setLoading(true);
        const { data: newData } = await Api.get(`/lessons`, {
          qs: { branchName, date },
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
    events: data,
    eventsError: error,
    eventsLoading: loading,
    getEvents,
  };
}