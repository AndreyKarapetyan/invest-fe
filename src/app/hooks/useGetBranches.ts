import { useCallback, useState } from 'react';
import { Api } from 'src/app/utils/Api';

export function useGetBranches() {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getBranches = useCallback(() => {
    (async function () {
      try {
        setLoading(true);
        const { data: newData } = await Api.get(`/branches`);
        setData(newData);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return {
    branches: data,
    branchesError: error,
    branchesLoading: loading,
    getBranches,
  };
}