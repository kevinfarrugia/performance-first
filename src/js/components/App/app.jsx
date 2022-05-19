import * as React from "react";
import { Provider } from "react-redux";

import Footer from "../Footer";
import Layout from "../Layout";
import styles from "./styles.scss";

function App({ store, children }) {
  return (
    <Provider store={store}>
      <Layout meta={{ title: "Performance First React Webpack" }}>
        <div className={styles.container}>
          {children}
          <Footer />
        </div>
      </Layout>
    </Provider>
  );
}

export default App;
