import React, { useState } from "react";

import Header from "../Header";
import ListItem from "../ListItem";
import styles from "./critical.scss";

function TodoList() {
  const [todoList, setTodoList] = useState([]);

  const handleSubmit = (todo) => {
    setTodoList([...todoList, todo]);
  };

  const handleRemove = (index) => {
    setTodoList([...todoList.slice(0, index), ...todoList.slice(index + 1)]);
  };

  return (
    <section className={styles.section}>
      <Header handleSubmit={handleSubmit} />
      <ul className={styles.list}>
        {todoList &&
          todoList.map((n, index) => (
            <ListItem
              key={n.id}
              id={index}
              title={n.value}
              handleRemove={handleRemove}
            />
          ))}
      </ul>
    </section>
  );
}

export default TodoList;
