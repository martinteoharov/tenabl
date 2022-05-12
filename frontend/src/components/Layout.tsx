import React, { FC, useEffect, useState } from 'react';
import "../styles/layout.css";
import Navbar from '../components/Navbar';
import { Theme } from "src/helpers/theme";
import { setTheme } from "../helpers/theme";
import { rtr } from "../services/authService";
import { Variable } from '@lbfalvy/mini-events';
import AuthForm from "../components/AuthForm";
import { spawnNotification } from "../helpers/notification";

interface Props {
    children: any;
    requireAuthentication: boolean;
}

const Layout: FC<Props> = ({ children, requireAuthentication }) => {
    const [token, setToken] = useState<Variable<string> | undefined>(rtr.session.get());

    useEffect(() => {
        setTheme(localStorage.getItem("theme") as Theme);

        rtr.session.changed(setToken);
    }, []);

    const handleLogout = () => {
        rtr.setPair(undefined);
        spawnNotification({ text: "Successfully logged out", type: "success" })
    }

    if (requireAuthentication && !token?.get()) {
        return (
            <div className="container">
                <Navbar isAuthenticated={Boolean(token?.get())} onLogout={handleLogout} />
                <div className="container-content">
                    <AuthForm type="login" />
                </div>
            </div>
        )
    }
    return (
        <div className="container">
            <Navbar isAuthenticated={Boolean(token?.get())} onLogout={handleLogout} />
            <div className="container-content">
                {children}
            </div>
        </div>
    )
}

export default Layout;