import { useState } from 'react';
import { Api } from 'src/app/utils/Api';

export function useGetStudents() {
  const take = 20; // @TODO: if everywhere this is same, have in configs
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getStudents = (branchName: null | string, isReset = false) => {
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
          },
        });
        const newData = isReset ? response.data : data.concat(response.data);
        setData(newData);
        setSkip((skip) => skip + take);
        setHasMore(newData.length < response.count);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  };

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