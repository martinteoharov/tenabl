import React, { FC, useEffect } from "react";
import Layout from "../components/Layout";
import Article from "../components/Article";
import { redirectGoogleOAuth } from "src/common/React/api/oauth/google";
import { redirectGithubOAuth } from "src/common/React/api/oauth/github";

import "../styles/home.css";
import { TokenPair } from "simple-rtr";
import { rtr } from "../services/authService";
import jwtDecode from "jwt-decode";
import { spawnNotification } from "src/common/React/helpers/notification";
import { useQuery } from "react-query";
import { getPopular } from "src/common/React/api/query/statistics";
import { IArticle } from "src/common/interfaces/article";

// const articlesTrending: ArticleProps[] = [
//   {
//     authorName: "Mahon Hourig",
//     title: "Northern Ireland: PM meets Stormont parties to avert crisis",
//     score: `${Math.floor(Math.random() * 100)}%`,
//     url: "/statistics/1"
//   },
// ]

// const articlesCurated: ArticleProps[] = [
//   {
//     authorName: "Fortunata Atif",
//     title: "School shooting in Buffalo, US",
//     score: `${Math.floor(Math.random() * 100)}%`,
//     url: "/statistics/2"
//   },
// ]

const handleGoogleOAuth = async (accessToken: string) => {
  // request user info
  const res = await redirectGoogleOAuth(accessToken) as any;

  // decode user
  const user = jwtDecode(res.accessToken) as any;
  spawnNotification({ type: "success", text: `Wellcome back, ${user.username}` });

  // set login
  const tokenPair: TokenPair = { auth: res.accessToken, refresh: res.refreshToken }
  rtr.setPair(tokenPair);
}

const handleGithubOAuth = async (code: string) => {
  // request user info
  const res = await redirectGithubOAuth(code) as any;

  console.log(res);

  // decode user
  const user = jwtDecode(res.accessToken) as any;
  spawnNotification({ type: "success", text: `Wellcome back, ${user.username}` });

  // set login
  const tokenPair: TokenPair = { auth: res.accessToken, refresh: res.refreshToken }
  rtr.setPair(tokenPair);
}

const Home: FC = () => {
  const paramString = window.location.hash.substring(1) || window.location.search
  const searchParams = React.useMemo(
    () => new URLSearchParams(paramString),
    [paramString]
  )
  const { data: popular } = useQuery<IArticle[]>("popular", getPopular)
  useEffect(() => {
    document.title = "Tenabl";

    // check if google access token & handle auth
    const googleAccessToken = searchParams.get("access_token");
    if (googleAccessToken) {
      handleGoogleOAuth(googleAccessToken);
    }

    // check if github code & handle auth
    const githubCode = searchParams.get("code");
    console.log("CODE")
    console.log(githubCode);
    if (githubCode) {
      console.log(githubCode);
      handleGithubOAuth(githubCode);
    }

  }, [searchParams]);


  return (
    <>
      <Layout requireAuthentication={true}>
        <div className="home-container">
          <div className="container-trending">
            <h1> TRENDING ON TENABL </h1>
            <div className="articles-container">
              {popular?.map(({ name, url }) => {
                return <div> <Article authorName={new URL(url).hostname} title={name} url={url} /> </div>
              })}
            </div>
          </div>
          {/* <div className="container-curated">
            <h1> CURATED FOR YOU </h1>
            <div className="articles-container">
              {articlesCurated.map(({ authorName, title, score, url }) => {
                return <div> <Article authorName={authorName} title={title} score={score} url={url} /> </div>
              })}
            </div>
          </div> */}
        </div>
      </Layout>


    </>
  );
};

export default Home;
