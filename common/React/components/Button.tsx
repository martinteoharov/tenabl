import React from 'react';
import './button.css';

export interface IProps {
    onClick: () => void;
    size: "s" | "m" | "l";
    children?: React.ReactNode;
}

const Button: React.FC<IProps> = (props: IProps) => {
    const sizeClassName = `button--size-${props.size}`;

    return (
        <button
            onClick={(e) => { e.preventDefault(); props.onClick() }}
            className={`button--accent ${sizeClassName}`}>
            {props.children}
        </button>
    )
}

export default Button;