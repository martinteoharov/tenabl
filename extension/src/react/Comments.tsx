import { classList } from "@lbfalvy/react-utils";
import './Rate.css';
import './Comments.css';
import { IComment } from "../common/interfaces/comment";
import React from "react";
import Button from "../common/React/components/Button";

export function Comments(): React.ReactElement {
    const [cmtv, setCmtv] = React.useState<IComment[]>([])
    const [comment, setComment] = React.useState('')
    return <div
        className={classList("tenabl_overlay", 'tenabl_comments')}
    >
        <div className="tenabl_comment-list">
            {cmtv.map(cmt => <div className="tenabl_comment">
                <address>{cmt.author}</address>
                <main>{cmt.comment}</main>
            </div>)}
        </div>
        <div className="tenabl_comment-form">
            <textarea value={comment} onChange={e => setComment(e.target.value)} />
            <Button onClick={() => {}} size='s'>Send</Button>
        </div>
    </div>
}