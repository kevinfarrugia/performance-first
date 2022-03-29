import * as React from "react";
import { Provider } from "react-redux";

import Footer from "../Footer";
import Layout from "../Layout";
import styles from "./critical.scss";

function App({ store, children }) {
  return (
    <Provider store={store}>
      <Layout meta={{ title: "Performance First React Webpack" }}>
        <div className={styles.container}>
          <div className={styles.content}>{children}</div>
          <Footer />
        </div>
      </Layout>
    </Provider>
  );
}

export default App;
