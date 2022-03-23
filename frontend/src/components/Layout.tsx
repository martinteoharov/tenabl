import React, { FC, useEffect } from 'react';
import "../styles/layout.css";
import Navbar from '../components/Navbar';
import { Theme } from "src/helpers/theme";
import { setTheme } from "../helpers/theme";

interface Props {
    children: any;
}

const Layout: FC<Props> = ({children}) => {
    useEffect(() => {
        setTheme(localStorage.getItem("theme") as Theme);
    }, []);

    return (
        <div className="container">
            <Navbar/>
            <div className="container-content">
                {children}
            </div>
        </div>
    )
}

export default Layout;