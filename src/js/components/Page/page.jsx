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
  onSetPath,
  onSetMeta,
}) {
  React.useEffect(() => {
    if (!isReady) {
      onGetPage({ path, ...params });
    }
  }, [isReady, onGetPage, params, path]);

  React.useEffect(() => {
    onSetPath({ path });
  }, [onSetPath, path]);

  React.useEffect(() => {
    if (page) {
      onSetMeta({ meta: page.meta });
    }
  }, [onSetMeta, page]);

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
