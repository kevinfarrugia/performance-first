import * as React from "react";
import { NavLink } from "react-router-dom";

import styles from "./critical.scss";
import logo from "./img/logo.png";

const activeStyle = {
  textDecoration: "underline",
};

function Header() {
  return (
    <header className={styles.header}>
      <img
        src={logo}
        alt="logo"
        width="64"
        height="64"
        className={styles.logo}
      />
      <nav className={styles.nav}>
        <NavLink
          className={styles.navLink}
          style={({ isActive }) => (isActive ? activeStyle : undefined)}
          to="/"
        >
          Home
        </NavLink>
        <NavLink
          className={styles.navLink}
          style={({ isActive }) => (isActive ? activeStyle : undefined)}
          to="/about"
        >
          About
        </NavLink>
      </nav>
    </header>
  );
}

export default Header;
