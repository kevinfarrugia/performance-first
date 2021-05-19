import React from "react";

import Footer from "../Footer";
import Layout from "../Layout";
import TodoList from "../TodoList";
import styles from "./critical.scss";

const App = () => {
  return (
    <Layout meta={{ title: "Performance First React Webpack" }}>
      <div className={styles.container}>
        <h1 className={styles.title}>todos</h1>
        <div className={styles.content}>
          <TodoList />
          <Footer />
        </div>
      </div>
    </Layout>
  );
};

export default App;
