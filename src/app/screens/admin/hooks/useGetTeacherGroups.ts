import { useState } from 'react';
import { Api } from 'src/app/utils/Api';

export function useGetTeacherGroups() {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getTeacherGroups = (teacherId: number) => {
    (async function () {
      try {
        setLoading(true);
        const { data: newData } = await Api.get(`/groups`, {
          qs: { teacherId },
        });
        setData(newData);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  };

  return {
    groups: data,
    groupsError: error,
    groupsLoading: loading,
    getTeacherGroups,
  };
}