import { Variable } from "@lbfalvy/mini-events";
import React from "react";
import { Article } from "../services/ratings"
import { Mini } from "./Mini";
import * as t from 'io-ts';
import { Rate } from "./Rate";
import { Comments } from "./Comments";

export interface OverlayProps {
    currentArticle: Variable<Article>
}

export function Overlay({ currentArticle }: OverlayProps): React.ReactElement {
    // Track variable
    const [art, setArt] = React.useState(currentArticle.get())
    React.useEffect(() => currentArticle.changed(setArt))
    console.log('Drawing something!!')
    // Ad-hoc navigation
    const [view, setView] = React.useState<'mini'|'rate'|'comments'>('mini')
    return <>{
        view == 'mini'?(
            <Mini article={art} go={setView} />
        ):view == 'rate'?(
            <Rate />
        ):view == 'comments'?(
            <Comments />
        ):null
    }</>
}