import * as React from "react";

import Page from "../Page";
import styles from "./critical.scss";

function About({ onGetAboutPage }) {
  const getPage = React.useCallback(onGetAboutPage, [onGetAboutPage]);

  return (
    <Page url="/about" onGetPage={getPage} scrollToTop>
      {({ page, isReady: isPageReady }) => {
        if (!isPageReady) {
          return null;
        }

        return (
          <>
            <h1 className={styles.title}>{page.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: page.html }} />
          </>
        );
      }}
    </Page>
  );
}

export default About;
