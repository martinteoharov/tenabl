import React, { FC, useEffect } from "react";
import Layout from "../components/Layout";

const Home: FC = () => {
  useEffect(() => {
    document.title = "Tenabl";
  }, []);

  return (
    <>
      <Layout requireAuthentication={true}> Welcome to tenabl! </Layout>
    </>
  );
};

export default Home;
