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

          <h1> Our team. </h1>
          <img width="200" height="200" src="https://scontent-lhr8-1.xx.fbcdn.net/v/t1.6435-9/50687334_976610279393382_3841496428320915456_n.jpg?_nc_cat=107&ccb=1-6&_nc_sid=09cbfe&_nc_ohc=h3dU2EdhkLQAX_Cyc1r&_nc_ht=scontent-lhr8-1.xx&oh=00_AT9yYcpAvE2OjJqOK5TBJpVJ2gdaLPSR98h2tdI1156a_g&oe=62A5165A"></img>

        </div>
      </Layout>
    </>
  );
};

export default Home;
