import React, { FC } from 'react';
import "../styles/layout.css";
import Navbar from '../components/Navbar';

interface Props {
    children: any;
}

const Layout: FC<Props> = ({children}) => {
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