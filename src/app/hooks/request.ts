import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { Api } from '../utils/Api';

enum RequestMethod {
  POST = 'POST',
  GET = 'GET',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export function useGetRequest(route: string, data?: object) {
  return useRequest(route, RequestMethod.GET, { qs: data });
}

export function usePostRequest(route: string, data: object) {
  return useRequest(route, RequestMethod.POST, data);
}

export function usePutRequest(route: string, data: object) {
  return useRequest(route, RequestMethod.PUT, data);
}

export function useDeleteRequest(route: string, data: object) {
  return useRequest(route, RequestMethod.DELETE, data);
}

function useRequest(route: string, method: RequestMethod, params: object = {}) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const makeRequest = (oldData: any[] = []) => {
    (async function () {
      try {
        setLoading(true);
        let response: AxiosResponse;
        if (method === RequestMethod.GET) {
          response = await Api.get(route, params);
        } else if (method === RequestMethod.POST) {
          response = await Api.post(route, params);
        } else if (method === RequestMethod.PUT) {
          response = await Api.put(route, params);
        } else {
          response = await Api.delete(route, params);
        }
        if (Array.isArray(response.data)) {
          setData(oldData.concat(response.data));
        } else {
          setData(response.data);
        }
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  };

  return { data, error, loading, makeRequest };
}
