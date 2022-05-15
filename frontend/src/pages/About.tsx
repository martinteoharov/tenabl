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

            This process will have a number of implications, and will tackle the three main types of false and/or harmful information (Wardle, Derakhsan, 2017). Verification will reduce misleading information (misinformation). Inference provided by approved experts will reduce the spread of disinformation, which consists of false, manipulated and fabricated content. Lastly, the well established trust network which our project will enable would possibly also tackle mal-information (leaks, harassment and hate speech).

            <br></br>
            <br></br>

            A secondary objective of our project is to cultivate a community of curious and knowledgeable users who share our vision for an internet where publications are more thoroughly reviewed and criticised by their writers, editors and readers alike. Doing so provides an alternative source of information that is verified by the community, for the community.
          </p>

          <h1> Our team. </h1>
          <img width="200" height="200" src="https://scontent-lhr8-1.xx.fbcdn.net/v/t1.6435-9/50687334_976610279393382_3841496428320915456_n.jpg?_nc_cat=107&ccb=1-6&_nc_sid=09cbfe&_nc_ohc=h3dU2EdhkLQAX_Cyc1r&_nc_ht=scontent-lhr8-1.xx&oh=00_AT9yYcpAvE2OjJqOK5TBJpVJ2gdaLPSR98h2tdI1156a_g&oe=62A5165A"></img>

        </div>
      </Layout>
    </>
  );
};

export default Home;
