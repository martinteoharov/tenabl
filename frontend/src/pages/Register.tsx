import React, { FC, useEffect } from "react";
import Layout from "../components/Layout";
import "../styles/register.css";

import AuthForm from "../components/AuthForm";

const Register: FC = () => {
  useEffect(() => {
    document.title = "Tenabl - Login";
  }, []);

  return (
    <>
      <Layout>

        <AuthForm type="register" />

      </Layout>
    </>
  );
};

export default Register;