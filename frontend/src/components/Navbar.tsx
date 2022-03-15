import React, { FC } from "react";
import { NavLink } from "react-router-dom";
import "../styles/navbar.css";

interface Props {}

const links = [
  { title: "Home", path: "/" },
  { title: "About", path: "/about" },
  { title: "Sample", path: "/sample" },
  { title: "Sample", path: "/sample" },
  { title: "Sample", path: "/sample" },
];

const Navbar: FC<Props> = () => {
  return (
    <div className="navbar navbar--dark">
      <p className="navbar-logo">
        tenabl.
      </p>
      <div className="navbar-links">
        {/* map links to <a> elements */}
        {links.map(({ title, path }) => (
          <NavLink 
          to={path} 
          className={({isActive}) => isActive ? 
            "navbar-button navbar-button--active" : "navbar-button"
          }>
            {title}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
