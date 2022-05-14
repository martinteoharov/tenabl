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
            The objectives of our project are to better inform members of the general public about the assessed quality of online publications based on the consensus of both approved experts and other users within the individual’s trust network. We believe that by achieving this we will help our users notice information discrepancies and biases in publications, which in turn will encourage them to further research and fact-check them. By encouraging this behaviour we hope to increase the likelihood of the users forming their own opinions based on factual information which they have personally verified.
            <br /> <br />
            A secondary objective of our project is to cultivate a community of curious and knowledgeable users who share our vision for an internet where publications are more thoroughly reviewed and criticised by their writers, editors and readers alike. Doing so provides an alternative source of information that is verified by the community, for the community, and takes the power of information-spreading out of the hands of institutions - the agenda of which cannot be verified by the day-to-day readers.
          </p>

          <h1> Our Team. </h1>
          <p>
            Our team is comprised of Year 2 students at the <b>University of Surrey</b>.
            Our sexiest member is Victor Virag:
          </p>
          <img width="200" height="200" src="https://scontent-lhr8-1.xx.fbcdn.net/v/t1.6435-9/50687334_976610279393382_3841496428320915456_n.jpg?_nc_cat=107&ccb=1-6&_nc_sid=09cbfe&_nc_ohc=h3dU2EdhkLQAX_Cyc1r&_nc_ht=scontent-lhr8-1.xx&oh=00_AT9yYcpAvE2OjJqOK5TBJpVJ2gdaLPSR98h2tdI1156a_g&oe=62A5165A"></img>

        </div>
      </Layout>
    </>
  );
};

export default Home;
