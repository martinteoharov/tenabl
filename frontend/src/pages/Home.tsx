import React, { FC, useEffect } from "react";
import Layout from "../components/Layout";
import { spawnNotification } from "../helpers/notification";

const Home: FC = () => {
  useEffect(() => {
    document.title = "Tenabl - Home";
    spawnNotification({ text: "hui" });
  }, []);

  return (
    <>
      <Layout> Welcome to tenabl! </Layout>
    </>
  );
};

export default Home;
