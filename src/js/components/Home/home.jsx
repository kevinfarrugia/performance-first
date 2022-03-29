import * as React from "react";

import Page from "../Page";
import TodoList from "../TodoList";
import styles from "./critical.scss";

function Home({ onGetHomePage }) {
  const getPage = React.useCallback(onGetHomePage, [onGetHomePage]);

  return (
    <Page url="/" onGetPage={getPage} scrollToTop>
      {({ page, isReady: isPageReady }) => {
        if (!isPageReady) {
          return null;
        }

        return (
          <>
            <h1 className={styles.title}>{page.title}</h1>
            <TodoList />
          </>
        );
      }}
    </Page>
  );
}

export default Home;