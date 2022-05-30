import React, { FC, useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import { useQuery } from "react-query";

import Layout from "src/components/Layout";

import { getStatistics } from "src/common/React/api/query/statistics";

import "src/styles/statistics.css";
import Button from "src/common/React/components/Button";
import Pie from "../components/Pie";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from 'recharts';

import { IStatistics } from "src/common/interfaces/statistics";
import { IArticle } from "src/common/interfaces/article";


const mapStatisticsToBarchart = (statistics: IStatistics[] | undefined) => {
    if (!statistics) return [];

    return statistics.map(({ name, positive, negative }) => ({ name, "positive votes": positive, "negative votes": negative }))
}

const mapStatisticsToPiechart = (statistics: IStatistics[] | undefined) => {
    if (!statistics) return [];

    return statistics.map(({ name, positive: positiveCount, negative: negativeCount }) => {
        const title = name;
        const data = [
            { name: "positive", value: positiveCount },
            { name: "negative", value: negativeCount },
        ]
        return { title, data }
    })
}

const Statistics: FC = () => {
    const { url } = useParams();

    const { data: statistics } = useQuery<{ statistics: IStatistics[], article?: IArticle }>("statistics", () => url ? getStatistics(url) : getStatistics());

    const [barchartData, setBarchartData] = useState(mapStatisticsToBarchart(statistics?.statistics));
    const [piechartData, setPiechartData] = useState(mapStatisticsToPiechart(statistics?.statistics))

    useEffect(() => {
        console.log('statistics', statistics);
        setBarchartData(mapStatisticsToBarchart(statistics?.statistics))
        setPiechartData(mapStatisticsToPiechart(statistics?.statistics))
    }, [statistics]);

    return (
        <>
            <Layout requireAuthentication={true}>
                <div className="statistics-container">
                    {statistics?.article ?
                        (<div className="statistics-header">
                            <h1> {statistics?.article?.name} </h1>
                            <p> {statistics?.article?.description} </p>
                            <Button onClick={() => window.open(statistics?.article?.url)} size="l"> Visit Article </Button>
                        </div>) :
                        (<div className="statistics-header">
                            <h1> Global Statistics </h1>
                            <p> The following graphs contain the median values for all articles scraped by us </p>
                        </div>)
                    }
                    <div className="statistics-bar-chart">
                        <BarChart
                            width={700}
                            height={600}
                            data={barchartData}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="positive votes" fill="#8884d8" />
                            <Bar dataKey="negative votes" fill="#82ca9d" />
                        </BarChart>

                    </div>
                    <div className="statistics-pie-chart">
                        {piechartData.map((pie, idx) => <Pie title={pie.title} data={pie.data} delay={idx * 500} />)}
                    </div>

                </div>
            </Layout>
        </>
    );
};

export default Statistics;
