import React, { FC, useEffect } from "react";
import Layout from "../components/Layout";

const Home: FC = () => {
  useEffect(() => {
    document.title = "Tenabl - About";
  }, []);

  return (
    <>
      <Layout> About! </Layout>
    </>
  );
};

export default Home;
