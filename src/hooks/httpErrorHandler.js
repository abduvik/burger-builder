import { useState, useEffect } from "react";

export default function useHttpErrorHandler(axios) {
  const [error, setError] = useState(null);

  const reqInterceptor = axios.interceptors.request.use(req => {
    setError(null);
    return req;
  });

  const resInterceptor = axios.interceptors.response.use(
    res => res,
    err => {
      setError(err);
    }
  );

  useEffect(() => {
    return () => {
      axios.interceptors.request.eject(reqInterceptor);
      axios.interceptors.response.eject(resInterceptor);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reqInterceptor, resInterceptor]);

  const errorConfirmedHandler = () => {
    setError(null);
  };

  return [error, errorConfirmedHandler];
}
