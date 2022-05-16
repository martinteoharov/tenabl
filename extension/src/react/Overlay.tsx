import { Variable } from "@lbfalvy/mini-events";
import React from "react";
import { Article } from "../services/ratings"
import { Mini } from "./Mini";
import * as t from 'io-ts';

export interface OverlayProps {
    currentArticle: Variable<Article>
}

export function Overlay({ currentArticle }: OverlayProps): React.ReactElement {
    // Track variable
    const [art, setArt] = React.useState(currentArticle.get())
    React.useEffect(() => currentArticle.changed(setArt))
    
    // Ad-hoc navigation
    const [view, setView] = React.useState<'mini'|'rate'|'comments'>('mini')
    return <>{
        view == 'mini'?(
            <Mini article={art} go={setView} />
        ):view == 'rate'?(
            null
        ):view == 'comments'?(
            null
        ):null
    }</>
}