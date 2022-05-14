import React from 'react';
import '../styles/article.css'
import { useNavigate } from "react-router-dom";

export interface ArticleProps {
    authorName: string;
    title: string;
    score: string;
    url: string;
}

const Article: React.FC<ArticleProps> = ({ authorName, title, score, url }) => {
    const navigate = useNavigate();

    return (
        <div onClick={() => navigate(url)} className="article">
            <p className="author">{authorName}</p>
            <p className="title">{title}</p>
            <p className="score">{score}</p>
        </div>
    )
}

export default Article;