import React, { FC, useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/navbar.css";

import Switch from "react-switch";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { setTheme } from '../helpers/theme';


interface Props {}

const links = [
  { title: "Home", path: "/" },
  { title: "About", path: "/about" },
  { title: "Sample", path: "/sample" },
  { title: "Sample", path: "/sample" },
  { title: "Sample", path: "/sample" },
];

const Navbar: FC<Props> = () => {
  const [checked, setChecked] = useState(false); 

  return (
    <div className="navbar">
      <div>
        <p className="navbar-logo">
          tenabl.
        </p>
        <div style={{display: "grid", alignItems: "center", justifyItems: "center"}}>
          <Switch 
            checkedIcon={<FontAwesomeIcon style={{padding: "4px 4px"}} icon={faSun} size="lg"/>}
            uncheckedIcon={<FontAwesomeIcon style={{padding: "4px 14px", color: "white"}} icon={faMoon} size="lg"/>}
            width={80}
            onHandleColor="#000000"
            offHandleColor="#ffffff"
            onColor="#ffffff"
            offColor="#000000"
            onChange={() => { setTheme(checked ? "dark" : "light"); setChecked(!checked) }} 
            checked={checked} />
        </div>
      </div>

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
