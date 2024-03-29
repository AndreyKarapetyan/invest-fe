import { useCallback, useState } from 'react';
import { Api } from 'src/app/utils/Api';

export function useGetPayments() {
  const take = 20; // @TODO: if everywhere this is same, have in configs
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getPayments = useCallback(
    (branchName: null | string, isReset = false, search?: string) => {
      (async function () {
        try {
          setLoading(true);
          const { data: response } = await Api.get(`/payments`, {
            qs: {
              pagination: { take, skip: isReset ? 0 : skip },
              branch: { branchName },
              search,
            },
          });
          setData((prevData) => {
            const newData = isReset
              ? response.data
              : prevData.concat(response.data);
            setHasMore(newData.length < response.count);
            return newData;
          });
          setSkip((prevSkip) => (isReset ? take : prevSkip + take));
        } catch (err: any) {
          setError(err);
        } finally {
          setLoading(false);
        }
      })();
    },
    [skip]
  );

  return {
    payments: data,
    paymentsError: error,
    paymentsLoading: loading,
    hasMore,
    getPayments,
  };
}
