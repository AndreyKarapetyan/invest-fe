import { useCallback, useState } from 'react';
import { Api } from 'src/app/utils/Api';

export function useGetStudents() {
  const take = 20; // @TODO: if everywhere this is same, have in configs
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getStudents = useCallback(
    (branchName: null | string, isReset = false, search?: string) => {
      if (isReset) {
        setSkip(0);
        setHasMore(true);
        setData([]);
      }
      (async function () {
        try {
          setLoading(true);
          const { data: response } = await Api.get(`/students/superadmin`, {
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

  const resetStudents = () => {
    setSkip(0);
    setHasMore(true);
    setData([]);
  };

  return {
    students: data,
    studentsError: error,
    resetStudents,
    studentsLoading: loading,
    hasMore,
    getStudents,
  };
}
