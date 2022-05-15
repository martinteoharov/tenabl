import React from 'react';
import Button from './Button';

import { loginGoogleOAuth } from '../api/oauth/google';

export interface IProps {
    clientId: string;
    size: "s" | "m" | "l";
    children?: React.ReactNode;
    onFailure?: () => void;
    onSuccess?: () => void;
    isSignedIn?: boolean;
}

const ButtonOAuth: React.FC<IProps> = ({ clientId, size, children }: IProps) => {

    return (
        <Button onClick={() => loginGoogleOAuth({ clientId })} size={size} children={children} />
    )
}

export default ButtonOAuth;