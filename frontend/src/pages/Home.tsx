import React, { FC, useEffect } from "react";
import Layout from "../components/Layout";
import Article, { ArticleProps } from "../components/Article";

import "../styles/home.css";

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

const Home: FC = () => {
  useEffect(() => {
    document.title = "Tenabl";
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
