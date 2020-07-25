import React, { useState } from "react";

import Header from "../header";
import ListItem from "../listItem";
import styles from "./critical.scss";

const TodoList = () => {
  const [todoList, setTodoList] = useState([]);

  const handleSubmit = (todo) => {
    setTodoList([...todoList, todo]);
  };

  const handleRemove = (index) => {
    setTodoList([...todoList.slice(0, index), ...todoList.slice(index + 1)]);
  };

  return (
    <section>
      <Header handleSubmit={handleSubmit} />
      <ul className={styles.list}>
        {todoList &&
          todoList.map((n, index) => (
            <ListItem
              key={n}
              id={index}
              title={n}
              handleRemove={handleRemove}
            />
          ))}
      </ul>
    </section>
  );
};

export default TodoList;
