import React from 'react';
import '../styles/article.css'

interface Props {
    authorName: string;
    title: string;
    score: string;
}

const Article: React.FC<Props> = ({authorName, title, score}) => {
    return (
        <div className="wrapper">
            <div className="article">
                <p className="author">{authorName}</p>
                <p className="title">{title}</p>
                <p className="score">{score}</p>
            </div>     
        </div>
    )
}

export default Article;