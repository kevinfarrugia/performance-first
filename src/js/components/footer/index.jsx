import React from "react";

import styles from "./critical.scss";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      Created by{" "}
      <a href="https://imkev.dev/" title="Kevin Farrugia">
        Kevin Farrugia
      </a>
    </footer>
  );
};

export default Footer;
