import { nanoid } from "nanoid";
import React, { useState } from "react";

import ListItem from "../ListItem";
import TodoListForm from "../TodoListForm";
import styles from "./critical.scss";

function TodoList() {
  const [todoList, setTodoList] = useState([
    { id: nanoid(), value: "Pet dog" },
    { id: nanoid(), value: "Feed dog" },
    { id: nanoid(), value: "Pet dog again" },
  ]);

  const handleSubmit = (todo) => {
    setTodoList([...todoList, todo]);
  };

  const handleRemove = (index) => {
    setTodoList([...todoList.slice(0, index), ...todoList.slice(index + 1)]);
  };

  return (
    <section className={styles.section}>
      <TodoListForm handleSubmit={handleSubmit} />
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
