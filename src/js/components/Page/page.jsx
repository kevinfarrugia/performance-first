import * as React from "react";

import ScrollToTop from "../ScrollToTop";

const DEFAULT_VALUE = {
  meta: {},
  id: 0,
};

function Page({
  path,
  isReady,
  page,
  params,
  onGetPage,
  children,
  scrollToTop,
}) {
  React.useEffect(() => {
    if (!isReady) {
      onGetPage({ path, ...params });
    }
  }, [onGetPage, params, path, isReady]);

  if (typeof onGetPage === "undefined") {
    console.warn("<Page /> requires 'onGetPage' prop to be defined");
    return null;
  }

  return (
    <>
      {scrollToTop && <ScrollToTop />}
      {children({ isReady, page: page ?? DEFAULT_VALUE })}
    </>
  );
}

export default Page;
