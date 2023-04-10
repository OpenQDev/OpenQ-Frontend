import { useEffect } from 'react';

function useAsync(asyncFn, onSuccess, deps) {
  useEffect(() => {
    let isActive = true;
    asyncFn().then((data) => {
      if (isActive) {
        onSuccess(data);
      }
    });
    return () => {
      isActive = false;
    };
  }, [onSuccess, ...deps]);
}
export default useAsync;
