import React, { useState } from 'react';
import Button from './Button';
import '../styles/form.css'
import { UserLoginRequest, UserRegisterRequest, fetchLogin, fetchRegister } from "../api/auth";
import { rtr } from "../services/authService"
import { TokenPair } from 'simple-rtr';
import { spawnNotification } from "../helpers/notification";
import jwtDecode from 'jwt-decode';

export interface IProps {
    type: "login" | "register";
}

const Form: React.FC<IProps> = (props: IProps) => {
    const [selected, setSelected] = useState(props.type);

    const handleLogin = async (data: UserLoginRequest) => {
        const res = await fetchLogin(data) as any;

        if (res) {
            // TODO avoid any
            const user = jwtDecode(res.accessToken) as any;
            spawnNotification({ type: "success", text: `Wellcome back, ${user.username}` });

            const tokenPair: TokenPair = { auth: res.accessToken, refresh: res.refreshToken }
            console.log("Using token pair: ", tokenPair)
            rtr.setPair(tokenPair);
        } else {
            spawnNotification({ type: "error", text: "Couldn't login", timeout: 3000 })
        }
    }

    const handleRegister = async (data: UserRegisterRequest) => {
        const res = await fetchRegister(data);

        if (res) {
            spawnNotification({ type: "success", text: "User Created." });
            // redirect to login
            setSelected("login");
        } else {
            spawnNotification({ type: "error", text: "Couldn't register.", timeout: 3000 })
        }

    }

    const RegisterInsteadButton = <a className="form-anchor" onClick={() => { setSelected("register") }}> Create an account instead </a>
    const LoginInsteadButton = <a className="form-anchor" onClick={() => { setSelected("login") }}> Login instead </a>

    return (
        <div>
            {selected === "login" ? <LoginForm switchButton={RegisterInsteadButton} onSubmit={handleLogin} /> :
                <RegisterForm switchButton={LoginInsteadButton} onSubmit={handleRegister} />}
        </div>
    )
}

interface ILoginProps {
    switchButton: any
    onSubmit: (data: UserLoginRequest) => void
}

const LoginForm: React.FC<ILoginProps> = (props: ILoginProps) => {
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();

    const handleSubmit = () => {
        if (!email || !password) {
            console.log("something is empty");
            return;
        }

        props.onSubmit({ email, password, acceptedTerms: true })
    }

    return (
        <form className="form">
            <label>Email</label>
            <input name="email" className="form-input" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
            <label>Password</label>
            <input name="password" className="form-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <div style={{ display: "grid", justifyContent: "center", alignItems: "center" }}>
                <Button onClick={handleSubmit} size="m"> LOGIN </Button>
            </div>
            {props.switchButton}
        </form>
    )
}

interface IRegisterProps {
    switchButton: any
    onSubmit: (data: UserRegisterRequest) => void
}
const RegisterForm: React.FC<IRegisterProps> = (props: IRegisterProps) => {
    const [email, setEmail] = useState<string>();
    const [username, setUsername] = useState<string>();
    const [firstName, setFirstName] = useState<string>();
    const [lastName, setLastName] = useState<string>();
    const [password, setPassword] = useState<string>();

    const handleSubmit = () => {
        if (!email || !username || !firstName || !lastName || !password) {
            console.log("something is empty");
            return;
        }

        props.onSubmit({ email, username, firstName, lastName, password, acceptedTerms: true })
    }

    return (
        <form className="form">
            <label>Email</label>
            <input name="email" className="form-input" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
            <label>Username</label>
            <input name="username" className="form-input" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            <label>First Name</label>
            <input name="firstName" className="form-input" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <label>Last Name</label>
            <input name="lastName" className="form-input" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            <label>Password</label>
            <input name="password" className="form-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <div style={{ display: "grid", justifyContent: "center", alignItems: "center" }}>
                <Button onClick={handleSubmit} size="m"> REGISTER </Button>
            </div>
            {props.switchButton}
        </form>
    )
}

export default Form;