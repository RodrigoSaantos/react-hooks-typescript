import axios, { AxiosRequestConfig } from "axios";
import { useEffect, useReducer, useRef } from "react";

export enum RequestType {
  request = "request",
  success = "success",
  failure = "failure",
}

export enum RequestStatus {
  init = "init",
  error = "error",
  fetched = "fetched",
  fetching = "fetching",
}

interface State<T> {
  status: RequestStatus;
  data?: T;
  error?: string;
}

interface Cache<T> {
  [url: string]: T;
}

type Action<T> = 
  | { type: RequestType.request}
  | { type: RequestType.success, payload: T}
  | { type: RequestType.failure, payload: string };

function useFetch<T = unknown>(url?: string, options?: AxiosRequestConfig): State<T> {
  const cache = useRef<Cache<T>>({});
  const cancelRequest = useRef<boolean>(false);

  const initialState: State<T> = {
    status: RequestStatus.init,
    data: undefined,
    error: undefined,
  };

  const fetchReducer = (state: State<T>, action: Action<T>): State<T> => {
    switch (action.type) {
      case RequestType.request:
        return {
          ...initialState,
          status: RequestStatus.fetching
        }

      case RequestType.success:
        return {
          ...initialState,
          data: action.payload,
          status: RequestStatus.fetched,
        }

      case RequestType.failure:
        return {
          ...initialState,
          error: action.payload,
          status: RequestStatus.error,
        }
      
      default: 
        return state;
    }
  };

  const [state, dispath] = useReducer(fetchReducer, initialState);

  useEffect(() => {
    if (!url) {
      return;
    }

    const fetchData = async () => {
      dispath({ type: RequestType.request });

      if (cache.current[url]) {
        dispath({ type: RequestType.success, payload: cache.current[url] });
      } else {
        try {
          const response = await axios(url, options);
          cache.current[url] = response.data;
          if (cancelRequest.current) return;

          dispath({ type: RequestType.success, payload: response.data});
        } catch (error: any) {
          if (cancelRequest.current) return;
          dispath({ type: RequestType.failure, payload: error.message });
        }
      }
    };

    fetchData()
  
    return () => {
      cancelRequest.current = true;
    };
  }, [options, url]);

  return state;
}

export default useFetch;