import * as React from "react";

import styles from "./critical.scss";

function Footer() {
  return (
    <footer className={styles.footer}>
      Created by{" "}
      <a
        href="https://imkev.dev/"
        title="Kevin Farrugia"
        target="_blank"
        rel="noreferrer"
      >
        Kevin Farrugia
      </a>
    </footer>
  );
}

export default Footer;
