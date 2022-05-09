import React, { FC, useEffect } from "react";
import Layout from "../components/Layout";
import "../styles/login.css";

import AuthForm from "../components/AuthForm";

const Login: FC = () => {
  useEffect(() => {
    document.title = "Tenabl - Login";
  }, []);

  return (
    <>
      <Layout>
        <AuthForm type="login"/>
      </Layout>
    </>
  );
};

export default Login;