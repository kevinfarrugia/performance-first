import React from "react";

import styles from "./critical.scss";

const Header = ({ handleSubmit }) => {
  return (
    <header>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.target;
          handleSubmit(new FormData(form).get("input"));
          form.reset();
        }}
      >
        <input
          name="input"
          type="text"
          placeholder="What needs to be done?"
          className={styles.input}
          autoComplete="off"
        />
      </form>
    </header>
  );
};

export default Header;
