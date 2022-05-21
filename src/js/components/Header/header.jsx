import * as React from "react";
import { NavLink } from "react-router-dom";

import logo from "./img/logo.png";
import styles from "./styles.scss";

const activeStyle = {
  textDecoration: "underline",
  pointerEvents: "none",
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
        <NavLink
          className={styles.navLink}
          style={({ isActive }) => (isActive ? activeStyle : undefined)}
          to="/page-a"
        >
          Page A
        </NavLink>
        <NavLink
          className={styles.navLink}
          style={({ isActive }) => (isActive ? activeStyle : undefined)}
          to="/page-b"
        >
          Page B
        </NavLink>
      </nav>
    </header>
  );
}

export default Header;
