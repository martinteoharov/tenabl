import React, { FC, useLayoutEffect, useState } from 'react';
import "src/styles/layout.css";
import Navbar from 'src/components/Navbar';
import { Theme } from "src/common/React/helpers/theme";
import { setTheme } from "src/common/React/helpers/theme";
import { rtr } from "src/services/authService";
import { Variable } from '@lbfalvy/mini-events';
import AuthForm from "src/common/React/components/AuthForm";
import { spawnNotification } from "src/common/React/helpers/notification";

interface Props {
    children: any;
    requireAuthentication: boolean;
}

const Layout: FC<Props> = ({ children, requireAuthentication }) => {
    const [token, setToken] = useState<Variable<string> | undefined>(rtr.session.get());

    useLayoutEffect(() => {
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