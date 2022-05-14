import React, { FC, useEffect } from "react";
import Layout from "../components/Layout";
import Article from "../components/Article";

const Home: FC = () => {
  useEffect(() => {
    document.title = "Tenabl";
  }, []);

  return (
    <>
      <Layout requireAuthentication={true}> Welcome to tenabl! 
      <Article 
        authorName="Author Name"
        title="Title Of the Article"
        score="68%"
      />
      </Layout>

      
    </>
  );
};

export default Home;
