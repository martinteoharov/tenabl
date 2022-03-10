export interface Session {
    id: string;
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

export interface EncodeResult {
    token: string,
    expires: number,
    issued: number
}

export type DecodeResult =
    | {
        type: "valid";
        session: Session;
    }
    | {
        type: "integrity-error";
    }
    | {
        type: "invalid-token";
    };

export type ExpirationStatus = "expired" | "active" | "grace";