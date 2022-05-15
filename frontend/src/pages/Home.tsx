import React, { FC, useEffect } from "react";
import Layout from "../components/Layout";
import Article, { ArticleProps } from "../components/Article";
import { redirectGoogleOAuth } from "src/common/React/api/oauth/google";

import "../styles/home.css";
import { TokenPair } from "simple-rtr";
import { rtr } from "src/common/React/services/authService";
import jwtDecode from "jwt-decode";
import { spawnNotification } from "src/common/React/helpers/notification";

const articlesTrending: ArticleProps[] = [
  {
    authorName: "kurami qnko",
    title: "Qnko izqde kur",
    score: `${Math.floor(Math.random() * 100)}%`,
    url: "/statistics/1"
  },
  {
    authorName: "kurami qnko",
    title: "Qnko izqde kur",
    score: `${Math.floor(Math.random() * 100)}%`,
    url: "/statistics/1"
  },
  {
    authorName: "kurami qnko",
    title: "Qnko izqde kur",
    score: `${Math.floor(Math.random() * 100)}%`,
    url: "/statistics/1"
  },
  {
    authorName: "kurami qnko",
    title: "Qnko izqde kur",
    score: `${Math.floor(Math.random() * 100)}%`,
    url: "/statistics/1"
  },
  {
    authorName: "kurami qnko",
    title: "Qnko izqde kur",
    score: `${Math.floor(Math.random() * 100)}%`,
    url: "/statistics/1"
  },
  {
    authorName: "kurami qnko",
    title: "Qnko izqde kur",
    score: `${Math.floor(Math.random() * 100)}%`,
    url: "/statistics/1"
  },
]

const articlesCurated: ArticleProps[] = [
  {
    authorName: "kurami qnko",
    title: "Qnko izqde kur",
    score: `${Math.floor(Math.random() * 100)}%`,
    url: "/statistics/1"
  },
  {
    authorName: "kurami qnko",
    title: "Qnko izqde kur",
    score: `${Math.floor(Math.random() * 100)}%`,
    url: "/statistics/1"
  },
]

const handleOAuth = async (accessToken: string) => {
  const res = await redirectGoogleOAuth(accessToken) as any;
  const user = jwtDecode(res.accessToken) as any;
  spawnNotification({ type: "success", text: `Wellcome back, ${user.username}` });
  const tokenPair: TokenPair = { auth: res.accessToken, refresh: res.refreshToken }
  rtr.setPair(tokenPair);
}
console.log(handleOAuth)

const Home: FC = () => {
  const searchParams = new URLSearchParams(window.location.hash.substring(1))

  useEffect(() => {
    document.title = "Tenabl";

    const accessToken = searchParams.get("access_token");

    if (accessToken) {
      handleOAuth(accessToken);
    }

  }, []);


  return (
    <>
      <Layout requireAuthentication={true}>
        <div className="home-container">
          <div className="container-trending">
            <h1> TRENDING ON TENABL </h1>
            <div className="articles-container">
              {articlesTrending.map(({ authorName, title, score, url }) => {
                return <div> <Article authorName={authorName} title={title} score={score} url={url} /> </div>
              })}
            </div>
          </div>
          <div className="container-curated">
            <h1> CURATED FOR YOU </h1>
            <div className="articles-container">
              {articlesCurated.map(({ authorName, title, score, url }) => {
                return <div> <Article authorName={authorName} title={title} score={score} url={url} /> </div>
              })}
            </div>
          </div>
        </div>
      </Layout>


    </>
  );
};

export default Home;
