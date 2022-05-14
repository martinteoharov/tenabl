import React, { FC, useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import { useQuery } from "react-query";

import Layout from "../components/Layout";

import { getStatisticsByArticleID } from "../api/query/statistics";

import "../styles/statistics.css";
import Button from "src/common/React/components/Button";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
} from 'recharts';

import { IStatistics } from "src/common/interfaces/statistics";


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
    const { id } = useParams();

    const { data: statistics } = useQuery("statistics", () => getStatisticsByArticleID(id || "0"));

    const [barchartData, setBarchartData] = useState(mapStatisticsToBarchart(statistics?.statistics));
    const [piechartData, setPiechartData] = useState(mapStatisticsToPiechart(statistics?.statistics))

    useEffect(() => {
        setBarchartData(mapStatisticsToBarchart(statistics?.statistics))
        setPiechartData(mapStatisticsToPiechart(statistics?.statistics))
    }, [statistics]);

    return (
        <>
            <Layout requireAuthentication={true}>
                <div className="statistics-container">
                    <div className="statistics-header">
                        <h1> {statistics?.article.name} </h1>
                        <p> {statistics?.article.description} </p>
                        <Button onClick={() => window.open(statistics?.article.url)} size="l"> Visit Article </Button>
                    </div>
                    <div className="statistics-bar-chart">
                        <BarChart
                            width={700}
                            height={500}
                            data={barchartData}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
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
                        {piechartData.map((pie) => {
                            return (
                                <div style={{ width: "100%" }}>
                                    <p style={{ textAlign: "center", width: "60%" }}>{pie.title}</p>
                                    <PieChart width={250} height={250}>
                                        <Pie data={pie.data} dataKey="value" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label />
                                    </PieChart>
                                </div>)
                        })}
                    </div>

                </div>
            </Layout>
        </>
    );
};

export default Statistics;
