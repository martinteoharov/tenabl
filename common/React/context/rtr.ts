import React from "react";
import { RtrAgent } from "simple-rtr";

export const rtrCtx = React.createContext<RtrAgent>({
    forceRefresh: () => { throw new Error('Context not defined') },
    setPair: () => { throw new Error('Context not defined') },
    session: {
        changed: () => { throw new Error('Context not defined') },
        get: () => { throw new Error('Context not defined') }
    },
    uniqueDelay: 0
})
