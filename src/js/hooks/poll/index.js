import * as React from "react";

const usePoll = ({ interval, callback }) => {
  const timeoutRef = React.useRef();

  const clearTimeoutIfSet = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const invokeCallback = React.useCallback(
    (onSuccess, onError) =>
      Promise.resolve(callback())
        .then(() => {
          onSuccess();
        })
        .catch(() => {
          onError();
        }),
    [callback]
  );

  const setPollTimeout = React.useCallback(() => {
    timeoutRef.current =
      interval > 0
        ? setTimeout(
            () => invokeCallback(setPollTimeout, setPollTimeout),
            interval
          )
        : null;
  }, [interval, invokeCallback]);

  React.useEffect(() => {
    clearTimeoutIfSet();
    const handle = setTimeout(() => {
      setPollTimeout();
    }, interval);

    return () => {
      clearTimeout(handle);
    };
  }, [interval, setPollTimeout]);

  React.useEffect(
    () => () => {
      clearTimeoutIfSet();
    },
    []
  );

  return timeoutRef;
};

export default usePoll;
