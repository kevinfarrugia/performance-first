import * as React from "react";

import Page from "../Page";
import TodoList from "../TodoList";
import styles from "./critical.scss";

function Home({ onGetHomePage }) {
  const getPage = React.useCallback(onGetHomePage, [onGetHomePage]);

  return (
    <Page url="/" onGetPage={getPage} scrollToTop>
      {({ page: { title, html }, isReady: isPageReady }) => {
        if (!isPageReady) {
          return null;
        }

        return (
          <div className={styles.content}>
            <h1 className={styles.title}>{title}</h1>
            {/* eslint-disable-next-line react/no-danger */}
            <div dangerouslySetInnerHTML={{ __html: html }} />
            <TodoList />
          </div>
        );
      }}
    </Page>
  );
}

export default Home;
