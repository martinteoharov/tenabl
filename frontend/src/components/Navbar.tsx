import React, { FC, useState } from "react";
import { Link, NavLink } from "react-router-dom";

import "../styles/navbar.css";

import Switch from "react-switch";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faHouse, faFile, faUser } from "@fortawesome/free-solid-svg-icons";

import { setTheme } from '../helpers/theme';

interface Link {
  title: string;
  path: string;
  icon: JSX.Element;
  hidden: boolean;
}

interface IProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

const Navbar: FC<IProps> = (props) => {
  // light = true; dark = false;
  const [checked, setChecked] = useState(localStorage.getItem("theme") === "light");

  const links: Link[] = [
    { title: "Home", path: "/", icon: <FontAwesomeIcon width="20px" icon={faHouse} size="lg" />, hidden: false },
    { title: "About", path: "/about", icon: <FontAwesomeIcon width="20px" icon={faFile} size="lg" />, hidden: false },
    { title: "Profile", path: "/profile", icon: <FontAwesomeIcon width="20px" icon={faUser} size="lg" />, hidden: !props.isAuthenticated },
  ];

  return (
    <div className="navbar">
      <div>
        <p className="navbar-logo">
          tenabl.
        </p>
        <div style={{ display: "grid", alignItems: "center", justifyItems: "center" }}>
          <Switch
            checkedIcon={<FontAwesomeIcon style={{ padding: "4px 4px" }} icon={faSun} size="lg" />}
            uncheckedIcon={<FontAwesomeIcon style={{ padding: "4px 14px", color: "white" }} icon={faMoon} size="lg" />}
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
        {links.map(({ title, path, icon, hidden }) => (
          hidden ? <></> :
            <NavLink
              key={`${title}`}
              to={path}
              className={({ isActive }) => isActive ?
                "navbar-button navbar-button--active" : "navbar-button"
              }>
              <div> {icon} {"\u00a0\u00a0"} {title} </div>
            </NavLink>
        ))}
      </div>
      <ProfileSection onLogout={props.onLogout} isAuthenticated={props.isAuthenticated} />

    </div>
  );
};

const ProfileSection: FC<IProps> = (props) => {

  if (props.isAuthenticated) {
    // const queryClient = useQueryClient();

    return (
      <div className="navbar-auth">
        <a onClick={props.onLogout}> Logout </a>
      </div>
    )
  }

  return <></>
}

export default Navbar;
