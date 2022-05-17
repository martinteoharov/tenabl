
import React, { useEffect, useState } from 'react';
import '../styles/pie.css'

import { getColor } from 'src/common/React/helpers/theme';

import {
    PieChart,
    Pie,
    Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F'];
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, color }: any) => {
    // eslint-disable-next-line
    const radius = 25 + innerRadius + (outerRadius - innerRadius);
    // eslint-disable-next-line
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    // eslint-disable-next-line
    const y = cy + radius * Math.sin(-midAngle * RADIAN);


    return (
        <text fill={color} x={x} y={y} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

export interface Props {
    title: string;
    data: any;
    delay: number;
}

const Article: React.FC<Props> = ({ title, data, delay }) => {
    const [shown, setShown] = useState(false);

    const [textColor, setTextColor] = useState(getColor());

    useEffect(() => {
        setTimeout(() => setShown(true), delay);
    })

    useEffect(() => {
        setTextColor(getColor());
    }, [getColor()])

    if (shown) {
        return (
            <div className='pie-container'>
                <PieChart width={250} height={250}>
                    <Pie data={data} dataKey="value" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label={(label) => renderCustomizedLabel({ ...label, color: textColor })} >
                        {data.map((_entry: any, index: any) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                </PieChart>
                <p>{title}</p>
            </div>)
    } else {
        return <div></div>
    }
}

export default Article;