import React, { FC, useEffect } from "react";
import Layout from "../components/Layout";
import "../styles/login.css";

const Login: FC = () => {
  useEffect(() => {
    document.title = "Tenabl - Login";
  }, []);

  return (
    <>
      <Layout> 
        <div className="form">
            <form>
            <div className="input-container">
                <label> Username </label>
                <input type="text" name="uname" required />
            </div>
            <div className="input-container">
                <label> Password </label>
                <input type="password" name="pass" required />
            </div>
            <div className="button-container">
                <input type="submit" />
            </div>
            </form>
        </div>

      </Layout>
    </>
  );
};

export default Login;