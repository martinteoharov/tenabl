import React, { FC, useEffect } from "react";
import Layout from "../components/Layout";


import "../styles/about.css";

const Home: FC = () => {
  useEffect(() => {
    document.title = "Tenabl";
  }, []);

  return (
    <>
      <Layout requireAuthentication={false}>
        <div className="about-container">
          <h1> Tenabl. </h1>
          <p>
            The main objective of our project is to better inform members of the general public about the quality of online publications. The assessment is based on the consensus of both approved experts and other users within a particular individual’s trust network. We believe that by achieving this we will help our users notice information discrepancies and biases in publications, which in turn will encourage them to further research and fact-check these publications. By promoting such behaviour we hope our users will form their own opinions based on factual information they have personally verified.
            <br></br>
            <br></br>
          </p>

        </div>
      </Layout>
    </>
  );
};

export default Home;
