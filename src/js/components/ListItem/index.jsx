import React from "react";

import styles from "./style.scss";

const ListItem = ({ id, title, handleRemove }) => {
  return (
    <li className={styles.listItem}>
      <input id={`i_${id}`} type="checkbox" className={styles.toggle} />
      <label htmlFor={`i_${id}`} className={styles.label}>
        {title}
      </label>
      <button
        type="button"
        className={styles.remove}
        onClick={() => {
          handleRemove(id);
        }}
      >
        Remove
      </button>
    </li>
  );
};

export default ListItem;
