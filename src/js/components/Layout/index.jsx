import * as React from "react";
import { Link } from "react-router-dom";

import Meta from "../Meta";
import styles from "./critical.scss";

function Layout({ meta, children }) {
  return (
    <>
      <Meta
        title={meta.title}
        description={meta.description}
        keywords={meta.keywords}
      />
      <nav className={styles.nav}>
        <Link className={styles.navLink} to="/">
          Home
        </Link>
        <Link className={styles.navLink} to="/about">
          About
        </Link>
      </nav>
      <main>{children}</main>
    </>
  );
}

export default Layout;
