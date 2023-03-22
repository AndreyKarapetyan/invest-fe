import { Api } from 'src/app/utils/Api';
import { useState } from 'react';

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

export function useGetBranches() {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getBranches = () => {
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
  };

  return {
    branches: data,
    branchesError: error,
    branchesLoading: loading,
    getBranches,
  };
}

export function useGetTeachers() {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getTeachers = (branchName: null | string) => {
    (async function () {
      try {
        setLoading(true);
        const { data: newData } = await Api.get(`/teachers/superadmin`, {
          qs: { branchName },
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
    teachers: data,
    teachersError: error,
    teachersLoading: loading,
    getTeachers,
  };
}

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

export function useCreateStudent() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const createStudent = (data: any) => {
    (async function () {
      try {
        setLoading(true);
        await Api.post(`/students`, data);
        setIsSuccess(true);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  };

  const resetStudentCreationSuccess = () => {
    setIsSuccess(false);
  }

  return {
    studentCreationError: error,
    studentCreationLoading: loading,
    isStudentCreated: isSuccess,
    resetStudentCreationSuccess,
    createStudent,
  };
}
