import React from 'react';
import Button from './Button';

import { loginGoogleOAuth } from '../api/oauth/google';
import { loginGithubOAuth } from '../api/oauth/github';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import {  } from "@fortawesome/free-solid-svg-icons";

export interface IProps {
    clientId: string;
    size: "s" | "m" | "l";
    children?: React.ReactNode;
    onFailure?: () => void;
    onSuccess?: () => void;
    isSignedIn?: boolean;
    type: "google" | "github";
}

const ButtonOAuth: React.FC<IProps> = ({ clientId, size, children, type }: IProps) => {

    if (type === "google") {
        return (
            <Button onClick={() => loginGoogleOAuth({ clientId })} size={size}>
                {children}
            </Button>
        )
    } else {
        return (
            <Button onClick={() => loginGithubOAuth({ clientId })} size={size}>
                {children}
            </Button>
        )
    }
}

export default ButtonOAuth;