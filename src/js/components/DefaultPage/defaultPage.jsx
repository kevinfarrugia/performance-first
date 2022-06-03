import * as React from "react";
import { useLocation } from "react-router-dom";

import Page from "../Page";
import ResponsivePicture from "../ResponsivePicture";
import styles from "./styles.scss";

function DefaultPage({ onGetPage }) {
  const { pathname } = useLocation();
  const getPage = React.useCallback(onGetPage, [onGetPage]);

  return (
    <Page path={pathname} onGetPage={getPage} scrollToTop>
      {({ page: { title, html, banner }, isReady: isPageReady }) => {
        if (!isPageReady) {
          return null;
        }

        return (
          <>
            {banner && (
              <ResponsivePicture
                image={banner.image}
                alt={banner.alt}
                width={banner.width}
                height={banner.height}
                caption={banner.caption}
                formats={banner.formats}
                availableWidths={banner.availableWidths}
                className={styles.banner}
              />
            )}
            <div className={styles.content}>
              <h1 className={styles.title}>{title}</h1>
              {/* eslint-disable-next-line react/no-danger */}
              <div dangerouslySetInnerHTML={{ __html: html }} />
            </div>
          </>
        );
      }}
    </Page>
  );
}

export default DefaultPage;
