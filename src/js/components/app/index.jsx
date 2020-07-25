import React from "react";

import Footer from "../footer";
import Layout from "../layout";
import TodoList from "../todoList";
import styles from "./critical.scss";

const App = () => {
  return (
    <Layout meta={{ title: "Critical CSS React Webpack" }}>
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
