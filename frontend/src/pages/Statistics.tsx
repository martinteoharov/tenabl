import React, { FC, useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import { useQuery } from "react-query";

import Layout from "../components/Layout";

import { getStatisticsByArticleID } from "../api/query/statistics";

import "../styles/statistics.css";

const Statistics: FC = () => {
    const { id: paramsId } = useParams();

    // TODO refactor this
    const id = parseInt(paramsId || "0");

    const { data: statistics } = useQuery("statistics", () => getStatisticsByArticleID(id));

    const [stats, setStats] = useState(statistics);

    useEffect(() => {
        setStats(statistics)
    }, [statistics]);

    return (
        <>
            <Layout requireAuthentication={true}>
                <div>
                    {id}
                    {JSON.stringify(stats)}
                </div>
            </Layout>
        </>
    );
};

export default Statistics;
