import React, { useState } from 'react';
import Button from './atoms/Button';
import '../styles/form.css'

export interface IProps {
    type: "login" | "register";
}

const Form: React.FC<IProps> = (props: IProps) => {
    const [selected, setSelected] = useState(props.type);

    return (
        <>
            {selected === "login" ? <LoginForm /> : <RegisterForm />}
            {selected === "login" ? (
                <p className="message">Not registered? <a onClick={(e) => { e.preventDefault(); setSelected("login") }}>Create an account</a></p>
            ) : (
                <p className="message">Already have an account? <a onClick={(e) => { e.preventDefault(); setSelected("register") }}>Login instead</a></p>
            )}
        </>
    )
}

const LoginForm: React.FC = () => {
    return (
        <form className="form">
            <input className="form-input" type="text" placeholder="Username" />
            <input className="form-input" type="password" placeholder="Password" />
            <Button onClick={() => { }} size="m"> Submit </Button>
        </form>
    )
}

const RegisterForm: React.FC = () => {

    return (
        <form className="form">
            <input className="form-input" type="text" placeholder="First Name" />
            <input className="form-input" type="text" placeholder="Last Name" />
            <input className="form-input" type="text" placeholder="Username" />
            <input className="form-input" type="password" placeholder="Password" />
            <Button onClick={() => { }} size="m"> Submit </Button>
        </form>
    )
}

export default Form;