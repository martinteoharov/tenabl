import React from 'react';
import '../styles/article.css'
import { useNavigate } from "react-router-dom";

export interface ArticleProps {
    authorName: string;
    title: string;
    url: string;
}

const Article: React.FC<ArticleProps> = ({ authorName, title, url }) => {
    const navigate = useNavigate();

    return (
        <div onClick={() => navigate(`/statistics/${encodeURIComponent(url)}`)}
            className="article"
        >
            <p className="author">{authorName}</p>
            <p className="title">{title}</p>
            {/* <p className="score">{score}</p> */}
        </div>
    )
}

export default Article;