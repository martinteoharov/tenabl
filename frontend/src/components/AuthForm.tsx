import React, { useState } from 'react';
import Button from './atoms/Button';
import '../styles/form.css'
import * as auth from "../api/auth";

export interface IProps {
    type: "login" | "register";
}

const Form: React.FC<IProps> = (props: IProps) => {
    const [selected, setSelected] = useState(props.type);

    const handleSubmit = (data: any) => {
        if(selected == "login") {
            auth.login(data);
        } else {
            auth.register(data);
        }
    }

    const RegisterInsteadButton = <a className="form-anchor" onClick={() => { setSelected("register") }}> Create an account instead </a>
    const LoginInsteadButton = <a className="form-anchor" onClick={() => { setSelected("login") }}> Login instead </a>

    return (
        <div>
            {selected === "login" ? <LoginForm switchButton={RegisterInsteadButton} onSubmit={(data) => handleSubmit(data)} /> :
                <RegisterForm switchButton={LoginInsteadButton} onSubmit={(data) => handleSubmit(data)} />}
        </div>
    )
}

interface ILoginProps {
    switchButton: any
    onSubmit: (data: any) => void
}
const LoginForm: React.FC<ILoginProps> = (props: ILoginProps) => {
    const [state, setState] = useState({});

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        });
    }

    return (
        <form className="form">
            <input name="username" className="form-input" type="text" placeholder="Username" onChange={onInputChange} />
            <input name="password" className="form-input" type="password" placeholder="Password" onChange={onInputChange} />
            <div style={{ display: "grid", justifyContent: "center", alignItems: "center" }}>
                <Button onClick={() => props.onSubmit(state)} size="m"> login </Button>
            </div>
            {props.switchButton}
        </form>
    )
}

interface IRegisterProps {
    switchButton: any
    onSubmit: (data: any) => void
}
const RegisterForm: React.FC<IRegisterProps> = (props: IRegisterProps) => {
    const [state, setState] = useState({});

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        });
    }

    return (
        <form className="form">
            <input name="first_name" className="form-input" type="text" placeholder="First Name" onChange={onInputChange} />
            <input name="last_name" className="form-input" type="text" placeholder="Last Name" onChange={onInputChange} />
            <input name="username" className="form-input" type="text" placeholder="Username" onChange={onInputChange} />
            <input name="password" className="form-input" type="password" placeholder="Password" onChange={onInputChange} />
            <div style={{ display: "grid", justifyContent: "center", alignItems: "center" }}>
                <Button onClick={() => props.onSubmit(state)} size="m"> register </Button>
            </div>
            {props.switchButton}
        </form>
    )
}

export default Form;