import * as React from "react";

import Page from "../Page";
import ResponsivePicture from "../ResponsivePicture";
import styles from "./critical.scss";

function About({ onGetAboutPage }) {
  const getPage = React.useCallback(onGetAboutPage, [onGetAboutPage]);

  return (
    <Page url="/about" onGetPage={getPage} scrollToTop>
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

export default About;
