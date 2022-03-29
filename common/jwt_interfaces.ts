import { string } from "fp-ts";

export interface Access {
    userId: string;
    username: string;
    /**
     * Timestamp indicating when the session was created, in Unix milliseconds.
     */
    issued: number;
    /**
     * Timestamp indicating when the session should expire, in Unix milliseconds.
     */
    expires: number;
}

export interface Refresh {
    sessionId: string;
    userId: string;
    /**
     * Timestamp indicating when the session should expire, in Unix milliseconds.
     */
    expires: number;
}

export interface EncodeResult {
    token: string,
    expires: number,
    issued: number
}

export type DecodeAccessResult =
    | {
        type: "valid";
        access: Access;
    }
    | {
        type: "invalid-token";
    };

export type DecodeRefreshResult =
    | {
        type: "valid";
        refresh: Refresh;
    }
    | {
        type: "invalid-token";
    };

export type ExpirationStatus = "expired" | "active" | "grace";