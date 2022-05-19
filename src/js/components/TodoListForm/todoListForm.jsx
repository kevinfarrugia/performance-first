import { nanoid } from "nanoid";
import * as React from "react";

import styles from "./styles.scss";

function TodoListForm({ handleSubmit }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        handleSubmit({
          id: formData.get("id"),
          value: formData.get("input"),
        });
        form.reset();
      }}
    >
      <input type="hidden" name="id" value={nanoid()} />
      <input
        name="input"
        type="text"
        placeholder="What needs to be done?"
        className={styles.input}
        autoComplete="off"
      />
    </form>
  );
}

export default TodoListForm;
