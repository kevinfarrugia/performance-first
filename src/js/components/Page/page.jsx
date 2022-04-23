import * as React from "react";
import { useMatch } from "react-router-dom";

import ScrollToTop from "../ScrollToTop";

const DEFAULT_VALUE = {
  meta: {},
  id: 0,
  title: null,
  html: null,
  url: null,
  thumbnail: null,
  banners: null,
};

function Page({
  url,
  isReady,
  page,
  params,
  onGetPage,
  onSetTitle,
  onSetMeta,
  children,
  scrollToTop,
}) {
  const match = useMatch(url);

  React.useEffect(() => {
    if (match) {
      // content doesn't exist in store
      onGetPage({ url, ...params });
    }
  }, [url, onSetTitle, onSetMeta, onGetPage, params, match]);

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
